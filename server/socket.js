/**
 * [Socket.io Manager]
 * Manages real-time bi-directional communication for Live Analytics.
 */
const { Server } = require('socket.io');
const { createCorsOptions, isAllowedOrigin } = require('./config/cors');

let activeUsers = 0;

const initSocket = (server) => {
  const { allowedOrigins, corsOptions } = createCorsOptions();

  const io = new Server(server, {
    cors: {
      origin: corsOptions.origin,
      methods: corsOptions.methods,
      allowedHeaders: corsOptions.allowedHeaders,
      credentials: corsOptions.credentials,
    },
    allowRequest: (req, callback) => {
      const origin = req.headers.origin;
      callback(null, isAllowedOrigin(origin, allowedOrigins));
    },
  });

  io.on('connection', (socket) => {
    activeUsers++;
    console.log(`📡 [Real-time] Node Connected. Total Active: ${activeUsers}`);

    // Broadcast new count to all clients
    io.emit('visitorCountUpdate', activeUsers);

    socket.on('disconnect', () => {
      activeUsers = Math.max(0, activeUsers - 1);
      console.log(`📡 [Real-time] Node Disconnected. Total Active: ${activeUsers}`);
      io.emit('visitorCountUpdate', activeUsers);
    });
  });

  return io;
};

module.exports = initSocket;
