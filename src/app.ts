import * as dotenv from 'dotenv';

import * as cluster from 'cluster';
import * as os from 'os';

import { logger } from './logger';

import * as MasterRoutes from './routes/MasterRoutes';
import * as ServerRoutes from './routes/ServerRoutes';
import * as SlaveRoutes from './routes/SlaveRoutes';

dotenv.config();

const serverType = process.env.SERVER_TYPE || 'MASTER';
const numCPUs = os.cpus().length;

if (cluster.isMaster) {
  logger.info(`Initializing multiplayer ${serverType} server spawner. Detected ${numCPUs} CPU's.`);

  if (serverType === 'MASTER') {
    MasterRoutes.Init();
  } else if (serverType === 'SLAVE') {
    SlaveRoutes.Init();
  } else {
    logger.fatal('Server Type not found!');
  }
} else {
  ServerRoutes.Init();
}
