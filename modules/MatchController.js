const ClusterSpawner = require('./ClusterSpawner')
const logger = require('../logger')
const uuidV4 = require('uuid/v4')

const matches = []

// [0] = Matchmaking Reference ID
module.exports.InitializeMatch = (data) => {
  // Generate a match ID & Auth Token
  // Send a signal to cluster spawner for a game cluster
  // Send ID, Auth token, IP & Port back to matchmaking
  const ref = data.args[0]
  const matchId = uuidV4()
  const authToken = 'auth-' + uuidV4()
  logger.info(`Initializing match with id: ${matchId}`)

  const port = ClusterSpawner.InitializeCluster(matchId, authToken)
  const IP = process.env.IP_ADDRESS || '127.0.0.1'

  data.client.send('match.initialize.success', ref, matchId, authToken, IP, port)
}
