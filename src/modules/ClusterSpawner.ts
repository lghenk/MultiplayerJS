import * as cluster from 'cluster';
import logger from '../logger';

const workers = [];

export function InitializeCluster(match_id, auth_token): [number, any] {
  const worker = cluster.fork();

  const port = parseInt(process.env.CLUSTER_PORT_START) + parseInt(process.env.PORT_INCREASE) * workers.length || 0;
  worker.send({
    event: 'init', port, matchId: match_id, authToken: auth_token,
  });

  workers.push(worker);

  return [port, worker];
}

cluster.on('online', (worker) => {
  logger.info(`Master: Got online signal from Game Cluster ${worker.id}`);
});

cluster.on('exit', (worker: any) => {
  workers.splice(workers.indexOf(worker), 1); // Remove worker from tracking list
  if (worker.process.exitCode === 0) {
    // Worker exited peacefully
    logger.info(`Game cluster ${worker.id} gracefully shutdown.`);
  } else {
    logger.error(`Game cluster ${worker.id} just crashed.`, { exit_code: worker.process.exitCode });

    // A game just crashed.
  }
});
