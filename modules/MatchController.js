const ClusterSpawner = require('./ClusterSpawner')

module.exports.InitializeMatch = (data) => {
  // Generate a match ID & Auth Token
  // Send a signal to cluster spawner for a game cluster
  // Send ID, Auth token, IP & Port back to matchmaking

  const IP = process.env.IP_ADDRESS || "127.0.0.1"
}