# BetaCrew Mock Exchange Client

## Overview

The BetaCrew Mock Exchange Client is a Node.js application designed to interact with the BetaCrew mock exchange server. It requests and receives stock ticker data from the server, ensures no packets are missed, and generates a JSON file (`output.json`) containing an array of objects, where each object represents a packet of data with increasing sequences.

## Prerequisites

- Node.js version 16.17.0 or higher

## Installation

1. **Clone the repository**

    ```bash
    git clone <repository-url>
    cd betacrew_exchange_client
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Download and run the BetaCrew exchange server**

    ```bash
    cd ./betacrew_exchange_server
    node main.js
    ```

## Running the Client

1. **Start the client**

    ```bash
    cd ./node_client
    npm start
    ```

2. **Output**

    - The client will connect to the server, request all available packets, handle any missing sequences, and generate an `output.json` file in the project root directory.

## Project Structure

```plaintext
.
├── controllers
│   └── clientController.js   # Handles the core logic for the client
├── models
│   └── packetModel.js        # Defines the packet data structure and utility functions
├── views
│   └── clientView.js         # Handles all console output for the client
├── main.js                   # Entry point for the client application
├── output.json               # Generated output file with all received packets
├── package.json              # Node.js dependencies and scripts
└── README.md                 # Project documentation

## Detailed Instructions

### Connecting to the Server

- The client connects to the BetaCrew exchange server running on `localhost` at port `3000`.
- Once connected, it requests all packets by sending a "Stream All Packets" request.

### Receiving Packets

- The server responds with packets, each 17 bytes long.
- The client parses these packets and stores them in memory.

### Handling Missing Sequences

- After receiving all packets, the client checks for any missing sequences.
- If missing sequences are detected, the client reconnects to the server and requests the missing packets individually.

### Generating Output

- Once all packets, including any previously missing packets, are received, the client saves the packets to `output.json`.

### Error Handling and Logging

- The client includes detailed logging for connection status, packet receipt, missing sequences, and errors.
- All logs are output to the console to provide clear and immediate feedback on the client's status and actions.
