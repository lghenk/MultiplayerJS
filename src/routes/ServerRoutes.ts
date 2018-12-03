import logger from '../logger'
import { SocketServer } from '../services/SocketServer'
import * as cluster from 'cluster'

const socket = new SocketServer(0)

socket.on('socket.listening', () => {
  // Server is now listening and ready for connections
  process.send({event: 'listening', port: socket._server.address().port});
})

process.on('message', (data) => {
  if(data.event == 'init') {
    logger.info(`Game Cluster ${cluster.worker.id}: Initializing with port ${data.port}`)
    socket._port = data.port;
    socket.startServer()
  }
})