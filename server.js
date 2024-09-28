const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const RustPlus = require("@liamcottle/rustplus.js");
const path = require("path");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const configPath = path.join(__dirname, "config.json");

io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("startup", async (data) => {
        const { ip, port, playerId, playerToken } = data;
    });

    socket.on("start-switches-configuration", async (data) => {});

    socket.on("set-server-connection", async (data) => {
        const { ip, port, playerId, playerToken } = data;

        try {
            // Initialize an empty cameras array for the user if not already present
            if (!userClients[socket.id]) {
                console.log("Initialize UserClient for " + socket.id);
                userClients[socket.id] = {
                    rustPlusInstance: createRustClient(
                        ip,
                        port,
                        playerId,
                        playerToken
                    ),
                    cameras: [],
                };
            }

            // Notify the frontend that the connection was successful
            socket.emit("connection_status", { success: true });
        } catch (error) {
            // Send failure response to the client with proper error message
            console.error(
                "Connection error:",
                error?.error || JSON.stringify(error)
            );
            socket.emit("connection_status", {
                success: false,
                error: error.error || JSON.stringify(error),
            });
        }
    });

    // Handle client disconnect and cleanup
    socket.on("disconnect", async () => {
        console.log(`Client disconnected: ${socket.id}`);
    });
});

function writeEntityDataToConfig(id, entityId, initialState) {
    try {
        const fileContent = fs.readFileSync(configPath, "utf-8");
        if (fileContent.length < 1) {
            throw new Error("Config file content is empty.");
        }
        const parsedFile = JSON.parse(fileContent);

        parsedFile.smartSwitches?.find;
    } catch (error) {
        console.error(
            "Write EntityData to config failed: " + JSON.stringify(error)
        );
    }
}

function readConfiguration() {}

function initialize() {}

// Start the server
const port = 1234;
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
