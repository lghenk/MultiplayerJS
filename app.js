require('dotenv').config()
const cluster = require('cluster')
const logger = require('./logger')
const os = require('os')

const serverType = process.env.SERVER_TYPE || 'MASTER'
const numCPUs = os.cpus().length

if (cluster.isMaster) {
  logger.info(`Initializing multiplayer ${serverType} server spawner. Detected ${numCPUs} CPU's. PID: ${process.pid}`)

  if(serverType === "MASTER") {
    require('./routes/MasterRoutes');
  } else if (serverType === "SLAVE") {
    require('./routes/SlaveRoutes')
  } else {
    logger.fatal('Server Type not found!')
  }
} else {
  logger.info(`Initializing cluster worker for game server. PID: ${process.pid}`)

  require('./routes/PlayerRoutes');
}
