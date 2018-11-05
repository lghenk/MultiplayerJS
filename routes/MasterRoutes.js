const logger = require('../logger')
const SocketServer = require('../services/SocketServer')

const socket = new SocketServer(process.env.MASTER_PORT || 2000)

logger.info("Setting up master server routes");

// ONLY THE MATCHMAKING AND OTHER AUTHENTICATED SERVICES SHOULD BE ALLOWED TO CONNECT HERE

socket.startServer();