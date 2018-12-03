const DispatcherEvent = require('./DispatcherEvent')

export default class Dispatcher {
  events = {};

  constructor () {
    this.events = {}
  }

  on (eventName, ...callbacks) {
    let event = this.events[eventName]

    if (!event) {
      event = new DispatcherEvent(eventName)
      this.events[eventName] = event
    }

    event.registerCallback(arguments)
  }

  off (eventName, ...callbacks) {
    let event = this.events[eventName]

    // Check if event exists, otherwise there is no callback to be unregistered
    if (event) { event.unregisterCallback(arguments) }

    if (event.GetCallbackCount() === 0) { delete this.events[eventName] }
  }

  once (eventName) {
    let arr = Array.from(arguments)
    arr.shift()

    this.on(eventName, arr)
    this.on(eventName, (data) => {
      // Hook onto that event and delete callback when event is fired
      this.off(eventName, arr)
    })
  }

  emit (eventName, data = null) {
    const event = this.events[eventName]

    if (event) { event.fire(data) }
  }
}

module.exports = Dispatcher
