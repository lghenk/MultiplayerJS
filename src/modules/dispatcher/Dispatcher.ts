import DispatcherEvent from './DispatcherEvent'

export default class Dispatcher {
  events: any = {};

  constructor() {
    this.events = {};
  }

  on(eventName: string, ...callbacks: any) {
    let event = this.events[eventName];

    if (!event) {
      event = new DispatcherEvent(eventName);
      this.events[eventName] = event;
    }

    event.registerCallback(arguments);
  }

  off(eventName: string, ...callbacks: any) {
    const event = this.events[eventName];

    // Check if event exists, otherwise there is no callback to be unregistered
    if (event) { event.unregisterCallback(arguments); }

    if (event.GetCallbackCount() === 0) { delete this.events[eventName]; }
  }

  once(eventName: string) {
    const arr = Array.from(arguments);
    arr.shift();

    this.on(eventName, arr);
    this.on(eventName, (data: any) => {
      // Hook onto that event and delete callback when event is fired
      this.off(eventName, arr);
    });
  }

  emit(eventName: string, data: any = null) {
    const event = this.events[eventName];

    if (event) { event.fire(data); }
  }
}

module.exports = Dispatcher;
