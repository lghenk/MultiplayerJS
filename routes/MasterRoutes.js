const logger = require('../logger')
const SocketServer = require('../services/SocketServer')

const ClusterSpawner = require('../modules/ClusterSpawner')

const socket = new SocketServer(process.env.MASTER_PORT || 2000)

logger.info('Setting up master server routes')

socket.on('client.message:match.initialize')

socket.startServer()
