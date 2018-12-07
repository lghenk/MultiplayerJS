import uuidV4 from 'uuid/v4';
import * as ClusterSpawner from './ClusterSpawner';
import {logger} from '../logger';

const matches = [];

// [0] = Matchmaking Reference ID, [1] = Expected num players, [2] = max players
export function InitializeMatch(data: any) {
  // Generate a match ID & Auth Token
  // Send a signal to cluster spawner for a game cluster
  // Send ID, Auth token, IP & Port back to matchmaking
  const ref = data.args[0];

  if (ref === undefined) {
    return data.client.send('match.initialize.failed', 'no reference provided');
  }

  const matchId = uuidV4();
  const authToken = `auth-${uuidV4()}`;
  logger.info(`Initializing match with id: ${matchId}`);

  const [port, worker] = ClusterSpawner.InitializeCluster(matchId, authToken);
  const IP = process.env.IP_ADDRESS || '127.0.0.1';

  worker.send({ event: 'setup', max_players: data.args[1], expected_players: data.args[2] });

  data.client.send('match.initialize.success', ref, matchId, authToken, IP, port);
}
