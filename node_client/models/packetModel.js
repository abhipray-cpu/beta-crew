/**
 * Represents a packet model.
 * @typedef {Object} PacketModel
 * @property {Array} receivedPackets - An array of received packets.
 * @property {Set} receivedSequences - A set of received sequences.
 * @property {Array} missingSequences - An array of missing sequences.
 */

/**
 * The packet model object.
 * @type {PacketModel}
 */
const packetModel = {
    receivedPackets: [],
    receivedSequences: new Set(),
    missingSequences: []
};

module.exports = packetModel;
