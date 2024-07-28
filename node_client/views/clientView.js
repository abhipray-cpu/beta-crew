/**
 * Represents a client view object.
 * @namespace clientView
 */
const clientView = {
    /**
     * Displays the connected status.
     * @memberof clientView
     * @function showConnected
     */
    showConnected: () => {
        console.log('-----------------------------------');
        console.log('        CONNECTION STATUS');
        console.log('-----------------------------------');
        console.log('Status: Connected to server');
        console.log('-----------------------------------');
    },
    /**
     * Displays the disconnected status.
     * @memberof clientView
     * @function showDisconnected
     */
    showDisconnected: () => {
        console.log('-----------------------------------');
        console.log('        CONNECTION STATUS');
        console.log('-----------------------------------');
        console.log('Status: Connection closed');
        console.log('-----------------------------------');
    },
    /**
     * Displays the reconnecting status.
     * @memberof clientView
     * @function showReconnecting
     * @param {number} attempt - The attempt number of the reconnection.
     */
    showReconnecting: (attempt) => {
        console.log('-----------------------------------');
        console.log('        CONNECTION STATUS');
        console.log('-----------------------------------');
        console.log(`Status: Reconnecting to server (Attempt ${attempt})`);
        console.log('-----------------------------------');
    },
    /**
     * Displays the status of requesting missing sequences.
     * @memberof clientView
     * @function showRequestingMissingSequences
     * @param {number[]} sequences - The missing sequences being requested.
     */
    showRequestingMissingSequences: (sequences) => {
        console.log('-----------------------------------');
        console.log('        PACKET REQUEST STATUS');
        console.log('-----------------------------------');
        console.log(`Requesting missing sequences: ${sequences.join(', ')}`);
        console.log('-----------------------------------');
    },
    /**
     * Displays the status of received packets.
     * @memberof clientView
     * @function showPacketsReceived
     * @param {Object[]} packets - The received packets.
     */
    showPacketsReceived: (packets) => {
        console.log('-----------------------------------');
        console.log('        PACKET RECEIPT STATUS');
        console.log('-----------------------------------');
        packets.forEach(packet => {
            console.log(`Packet received: ${JSON.stringify(packet)}`);
        });
        console.log('-----------------------------------');
    },
    /**
     * Displays the status of saved packets.
     * @memberof clientView
     * @function showPacketsSaved
     */
    showPacketsSaved: () => {
        console.log('-----------------------------------');
        console.log('        PACKET SAVE STATUS');
        console.log('-----------------------------------');
        console.log('All packets received and saved to output.json');
        console.log('-----------------------------------');
    },
    /**
     * Displays an error message.
     * @memberof clientView
     * @function showError
     * @param {Error} err - The error object.
     */
    showError: (err) => {
        console.error('-----------------------------------');
        console.error('        ERROR');
        console.error('-----------------------------------');
        console.error(`Error: ${err.message}`);
        console.error('-----------------------------------');
    },
    /**
     * Displays general information.
     * @memberof clientView
     * @function showGeneralInfo
     * @param {string} info - The general information to display.
     */
    showGeneralInfo: (info) => {
        console.log('-----------------------------------');
        console.log('        GENERAL INFO');
        console.log('-----------------------------------');
        console.log(info);
        console.log('-----------------------------------');
    }
};

module.exports = clientView;
