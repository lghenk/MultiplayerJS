import * as net from 'net';
import uuidV4 from 'uuid/v4';
import logger from '../logger';
import Dispatcher from '../modules/dispatcher/Dispatcher';

/*
 * Keeping in mind the idea that we might need to open different sockets in the future
 */

// TODO: Add encryption option
// TODO: Prevent against replay attack

export class SocketServer extends Dispatcher {
  _port: number;

  _server: any;

  constructor(port) {
    super();

    this._port = port;
    this.initServer();
  }

  initServer() {
    this._server = net.createServer((socket: any) => {
      socket.connected = true;
      this.emit('client.connect', { client: socket });

      // Generate a session id
      // FIXME: Get this out of the socket service!
      socket.id = uuidV4();
      socket.write(`welcome|${socket.id}`);

      // I went for args seperated by , because not every language has JSON directly build in
      socket.send = (eventName, ...args) => {
        if (socket.connected) {
          const data = args.toString();
          const payload = `${eventName}|${data}\n`;
          socket.write(payload);
        } else {
          logger.warn('Tried to send message to disconnected socket', { socket, event: eventName, data: args });
        }
      };

      this.initSocketListeners(socket);
    });

    this.initServerListeners();
  }

  initSocketListeners(socket) {
    socket.on('data', data => this.onSocketData(socket, data));

    socket.on('end', () => {
      this.emit('client.end', { client: socket });
    });

    socket.on('close', () => {
      socket.connected = false;
      this.emit('client.disconnect', { client: socket });
      socket.destroy();
    });

    socket.on('error', (err) => {
      if (err.errno !== 'ECONNRESET') { logger.error(`Server running on port ${this._port} caught an error ${err.name}`, err, socket); }

      this.emit('client.error', { client: socket, error: err });
    });
  }

  onSocketData(socket, data) {
    // Client send data, Emit a callback for this socket
    const dataParsed = data.toString('utf8').trim().split('|');

    // TODO: Check last character for \n
    if (dataParsed.length === 0) {
      // We've gotten some incorrect input here
    } else {
      const evnt = dataParsed[0];
      console.log(dataParsed);
      const args = (dataParsed[1]) ? dataParsed[1].split(',') : [];

      if (evnt === 'ping') { socket.write('pong\r\n'); }

      this.emit(`client.message:${dataParsed[0]}`, {
        client: socket, event: evnt, args, raw: data,
      });

      // A wild card for all messages coming through
      this.emit('client.message', {
        client: socket, event: evnt, args, raw: data,
      });
    }
  }

  initServerListeners() {
    this._server.on('close', () => {
      logger.info(`Server running on port ${this._server.address().port} has been closed`);
      this.emit('socket.closed');
    });

    this._server.on('error', (error) => {
      if (error.errno !== 'ECONNRESET') { logger.fatal(`Server attempted to run on port ${this._port} errored with error ${error.name}`, error); }

      this.emit('socket.error', { error });
    });

    this._server.on('listening', () => {
      logger.info(`Server running on port ${this._server.address().port} is now listening for connections`);
      this.emit('socket.listening');
    });
  }

  startServer() {
    this._server.listen(this._port);
  }

  stopServer() {
    this._server.unref();
    this._server.close();
  }
}

module.exports = SocketServer;
