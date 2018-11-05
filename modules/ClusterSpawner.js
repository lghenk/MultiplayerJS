const logger = require('./../logger')
const cluster = require('cluster')

const workers = []

module.exports.InitializeCluster = (match_id) => {
  // Here we 
  let worker = cluster.fork();
}

cluster.on('online', (worker) => {
  logger.info(`Master: Got online signal from Game Cluster ${worker.id}`)
})

cluster.on('exit', (worker) => {
  if (worker.process.exitCode === 0) {
    // Worker exited peacefully
    logger.info(`Game cluster ${worker.id} gracefully shutdown.`)
  } else {
    logger.error(`Game cluster ${worker.id} just crashed.`, {exit_code: worker.process.exitCode})
    // A game just crashed.
  }
})

this.InitializeCluster(999);
