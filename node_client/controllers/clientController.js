const net = require('net'); // Import the net module to create a TCP client
const fs = require('fs'); // Import the fs module for file system operations
const clientView = require('../views/clientView'); // Import the clientView module for displaying messages to the user
const packetModel = require('../models/packetModel'); // Import the packetModel module for managing received packets

// Constants for the server's host, port, and reconnection parameters
const HOST = '127.0.0.1';
const PORT = 3000;
const MAX_RECONNECT_ATTEMPTS = 5;
const RECONNECT_INTERVAL = 1000; // Reconnect interval in milliseconds (1 second)

// Global variables for the client socket and reconnection attempt counter
let client;
let reconnectAttempts = 0;

/**
 * Parses a packet from a buffer.
 * @param {Buffer} buffer - The buffer containing the packet data.
 * @returns An object representing the parsed packet.
 */
function parsePacket(buffer) {
    return {
        symbol: buffer.slice(0, 4).toString('ascii'), // Extracts the symbol from the first 4 bytes
        buySellIndicator: buffer.slice(4, 5).toString('ascii'), // Extracts the buy/sell indicator from the next byte
        quantity: buffer.readInt32BE(5), // Extracts the quantity as a 32-bit big-endian integer
        price: buffer.readInt32BE(9), // Extracts the price as a 32-bit big-endian integer
        sequence: buffer.readInt32BE(13) // Extracts the sequence number as a 32-bit big-endian integer
    };
}

/**
 * Validates a parsed packet to ensure data integrity.
 * @param {Object} packet - The parsed packet to validate.
 * @returns {boolean} - Returns true if the packet is valid, otherwise false.
 */
function validatePacket(packet) {
    if (typeof packet.symbol !== 'string' || packet.symbol.length !== 4) return false; // Validate symbol
    if (packet.buySellIndicator !== 'B' && packet.buySellIndicator !== 'S') return false; // Validate buy/sell indicator
    if (typeof packet.quantity !== 'number' || packet.quantity <= 0) return false; // Validate quantity
    if (typeof packet.price !== 'number' || packet.price <= 0) return false; // Validate price
    if (typeof packet.sequence !== 'number' || packet.sequence < 0) return false; // Validate sequence
    return true;
}

/**
 * Requests all packets from the server.
 */
function requestAllPackets() {
    const buffer = Buffer.alloc(1); // Allocates a buffer of 1 byte
    buffer.writeUInt8(1, 0); // Sets the call type to 1 (Stream All Packets)
    client.write(buffer); // Sends the request to the server
}

/**
 * Requests a specific packet by its sequence number.
 * @param {number} sequence - The sequence number of the packet to request.
 */
function requestPacket(sequence) {
    const buffer = Buffer.alloc(5); // Allocates a buffer of 5 bytes
    buffer.writeUInt8(2, 0); // Sets the call type to 2 (Resend Packet)
    buffer.writeUInt32BE(sequence, 1); // Writes the sequence number as a 32-bit big-endian integer
    client.write(buffer); // Sends the request to the server
}

/**
 * Identifies missing sequences in the received packets.
 */
function identifyMissingSequences() {
    const sequences = Array.from(packetModel.receivedSequences).sort((a, b) => a - b); // Sorts the received sequences
    packetModel.missingSequences = []; // Resets the missing sequences array
    // Loops through the range of sequences to find missing ones
    for (let i = sequences[0]; i <= sequences[sequences.length - 1]; i++) {
        if (!packetModel.receivedSequences.has(i)) {
            packetModel.missingSequences.push(i); // Adds missing sequences to the array
        }
    }
}

/**
 * Handles incoming data from the server.
 * @param {Buffer} data - The received data.
 */
function handleData(data) {
    let offset = 0; // Offset for parsing packets in the buffer
    // Loops through the data buffer to parse all packets
    while (offset < data.length) {
        const packet = data.slice(offset, offset + 17); // Each packet is 17 bytes long
        const parsedPacket = parsePacket(packet); // Parses the packet
        if (validatePacket(parsedPacket)) {
            packetModel.receivedPackets.push(parsedPacket); // Adds the parsed packet to the received packets array
            packetModel.receivedSequences.add(parsedPacket.sequence); // Adds the sequence number to the set of received sequences
        } else {
            clientView.showGeneralInfo(`Invalid packet detected and skipped: ${JSON.stringify(parsedPacket)}`);
        }
        offset += 17; // Moves the offset to the next packet
    }
    clientView.showPacketsReceived(packetModel.receivedPackets); // Displays the received packets
}

/**
 * Connects the client to the server.
 */
function connectClient() {
    client = new net.Socket(); // Creates a new socket
    client.connect(PORT, HOST, () => {
        clientView.showConnected(); // Displays a connected message
        requestAllPackets(); // Requests all packets from the server
    });

    // Event listener for data received from the server
    client.on('data', (data) => {
        handleData(data); // Handles the received data
    });

    // Event listener for the connection closing
    client.on('close', () => {
        clientView.showDisconnected(); // Displays a disconnected message
        identifyMissingSequences(); // Identifies any missing sequences
        if (packetModel.missingSequences.length > 0) {
            reconnectAttempts = 0; // Resets the reconnect attempts counter
            reconnectClient(); // Attempts to reconnect to the server
        } else {
            fs.writeFileSync('output.json', JSON.stringify(packetModel.receivedPackets, null, 2)); // Saves the received packets to a file
            clientView.showPacketsSaved(); // Displays a message indicating the packets were saved
        }
    });

    // Event listener for errors on the connection
    client.on('error', (err) => {
        clientView.showError(err); // Displays an error message
        reconnectClient(); // Attempts to reconnect to the server
    });
}

/**
 * Attempts to reconnect the client to the server.
 */
function reconnectClient() {
    if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
        reconnectAttempts++; // Increments the reconnect attempts counter
        setTimeout(() => {
            clientView.showReconnecting(reconnectAttempts); // Displays a reconnecting message
            connectClient(); // Attempts to connect to the server
        }, RECONNECT_INTERVAL);
    } else {
        clientView.showGeneralInfo('Max reconnect attempts reached. Could not reconnect to server.'); // Displays a message when max reconnect attempts are reached
    }
}

module.exports = {
    connectClient // Exports the connectClient function for use in other modules
};
