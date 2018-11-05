const logger = require('./../logger')
const net = require('net')
const Dispatcher = require('./../modules/dispatcher/Dispatcher')
const uuidV4 = require('uuid/v4')

/*
 * Keeping in mind the idea that we might need to open different sockets in the future
 */

// TODO: Add encryption option

class SocketService extends Dispatcher {
  constructor (port) {
    super()

    this._port = port
    this.initSocket()
  }

  initSocket () {
    this._server = net.createServer((socket) => {
      socket.connected = true
      this.emit('client.connect', { client: socket })

      // Generate a session id
      // FIXME: Get this out of the socket service!
      socket.id = uuidV4()
      socket.write('welcome|' + socket.id)

      // I went for args seperated by , because not every language has JSON directly build in
      socket.send = (eventName, ...args) => {
        if (socket.connected) {
          let data = args.split(',')
          let payload = `${eventName}|${data}\n`
          socket.write(payload)
        } else {
          logger.warn('Tried to send message to disconnected socket', { socket: socket, event: eventName, data: args })
        }
        console.log(socket.id)
      }

      this.initSocketListeners(socket)
    })

    this.initServerListeners()
  }

  initSocketListeners (socket) {
    socket.on('data', (data) => this.onSocketData(socket, data))

    socket.on('end', () => {
      this.emit('client.end', { client: socket })
    })

    socket.on('close', () => {
      socket.connected = false
      this.emit('client.disconnect', { client: socket })
      socket.destroy()
    })

    socket.on('error', (err) => {
      if (err.errno !== 'ECONNRESET') { logger.error(`Server running on port ${this._port} caught an error ${err.name}`, err, socket) }

      this.emit('client.error', { client: socket, error: err })
    })
  }

  onSocketData (socket, data) {
    // Client send data, Emit a callback for this socket
    let dataParsed = data.toString('utf8').trim().split('|')

    // TODO: Check last character for \n
    if (dataParsed.length === 0) {
      // We've gotten some incorrect input here
    } else {
      let evnt = dataParsed[0]
      let args = dataParsed[1].split(',') || []

      if (evnt === 'ping') { socket.write('pong\r\n') }

      this.emit(`client.message.${dataParsed[0]}`, { client: socket, event: evnt, args: args, raw: data })

      // A wild card for all messages coming through
      this.emit('client.message', { client: socket, event: evnt, args: args, raw: data })
    }
  }

  initServerListeners () {
    this._server.on('close', () => {
      logger.info(`Server running on port ${this._port} has been closed`)
      this.emit('socket.closed')
    })

    this._server.on('error', (error) => {
      if (error.errno !== 'ECONNRESET') { logger.fatal(`Server running on port ${this._port} errored with error ${error.name}`, error) }

      this.emit('socket.error', { error: error })
    })

    this._server.on('listening', () => {
      logger.info(`Server running on port ${this._port} is now listening for connections`)
      this.emit('socket.listening')
    })
  }

  openConnection () {
    this._server.listen(this._port)
  }

  closeConnection () {
    this._server.unref()
    this._server.close()
  }
}

module.exports = SocketService
