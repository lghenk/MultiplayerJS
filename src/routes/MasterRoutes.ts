import logger from '../logger'
import { SocketServer } from '../services/SocketServer'
import * as MatchController from './../modules/MatchController'

const socket = new SocketServer(process.env.MASTER_PORT || 2000)

logger.info('Setting up master server routes')

socket.on('client.message:match.initialize', MatchController.InitializeMatch)

socket.startServer()
