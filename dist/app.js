"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = __importStar(require("dotenv"));
dotenv.config();
var cluster = __importStar(require("cluster"));
var os = __importStar(require("os"));
var logger_1 = require("./logger");
var MasterRoutes = __importStar(require("./routes/MasterRoutes"));
var ServerRoutes = __importStar(require("./routes/ServerRoutes"));
var SlaveRoutes = __importStar(require("./routes/SlaveRoutes"));
var serverType = process.env.SERVER_TYPE || 'MASTER';
var numCPUs = os.cpus().length;
if (cluster.isMaster) {
    logger_1.logger.info("Initializing multiplayer " + serverType + " server spawner. Detected " + numCPUs + " CPU's.");
    if (serverType === 'MASTER') {
        MasterRoutes.Init();
    }
    else if (serverType === 'SLAVE') {
        SlaveRoutes.Init();
    }
    else {
        logger_1.logger.fatal('Server Type not found!');
    }
}
else {
    ServerRoutes.Init();
}
