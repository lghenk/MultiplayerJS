require('dotenv').config()
const cluster = require('cluster')
const logger = require('./logger')
const os = require('os')

const serverType = process.env.SERVER_TYPE || 'MASTER'
const numCPUs = os.cpus().length

if (cluster.isMaster) {
  logger.info(`Initializing multiplayer ${serverType} server spawner. Detected ${numCPUs} CPU's.`)

  if (serverType === 'MASTER') {
    require('./routes/MasterRoutes')
  } else if (serverType === 'SLAVE') {
    require('./routes/SlaveRoutes')
  } else {
    logger.fatal('Server Type not found!')
  }
} else {
  logger.info(`Game Cluster ${cluster.worker.id}: Initializing`)

  require('./routes/PlayerRoutes')
}
