/**
 * [Socket.io Manager]
 * Manages real-time bi-directional communication for Live Analytics.
 */
const { Server } = require("socket.io");

let activeUsers = 0;
const normalizeOrigin = (value = '') => value.trim().replace(/\/+$/, '');

const initSocket = (server) => {
    const clientOrigins = (process.env.CLIENT_URL || '')
        .split(',')
        .map(normalizeOrigin)
        .filter(Boolean);

    const io = new Server(server, {
        cors: {
            origin: clientOrigins.length > 0 ? clientOrigins : ["http://localhost:3000"],
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        activeUsers++;
        console.log(`📡 [Real-time] Node Connected. Total Active: ${activeUsers}`);
        
        // Broadcast new count to all clients
        io.emit("visitorCountUpdate", activeUsers);

        socket.on("disconnect", () => {
            activeUsers = Math.max(0, activeUsers - 1);
            console.log(`📡 [Real-time] Node Disconnected. Total Active: ${activeUsers}`);
            io.emit("visitorCountUpdate", activeUsers);
        });
    });

    return io;
};

module.exports = initSocket;
