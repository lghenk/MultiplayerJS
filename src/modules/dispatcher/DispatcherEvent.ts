const _ = require('lodash');

class DispatcherEvent {
  eventName: string;

  callbacks = [];

  constructor(eventName) {
    this.eventName = eventName;
    this.callbacks = [];
  }

  registerCallback() {
    if (arguments.length > 0) {
      delete arguments[0]['0'];
      const arr = Array.from(arguments[0]);
      arr.shift();

      // Because of .once we can also receive one argument with an array inside.. Remove excess array
      const obj = (typeof arr[0] === 'object') ? arr[0] : arr;

      this.callbacks.push(obj);
    }
  }

  unregisterCallback() {
    delete arguments[0]['0'];
    const arr = Array.from(arguments[0]);
    arr.shift();

    // Because of .once we can also receive one argument with an array inside.. Remove excess array
    const obj = (typeof arr[0] === 'object') ? arr[0] : arr;

    let index = -1;
    for (let i = 0; i < this.callbacks.length; i++) {
      const element = this.callbacks[i];
      if (_.isEqual(obj, element)) {
        index = i;
        break;
      }
    }

    if (index === -1) { return; }

    this.callbacks.splice(index, 1);
  }

  fire(data) {
    // Get a copy of the callbacks incase it gets edited mid emit
    const cbacks = this.callbacks.slice();
    cbacks.forEach((callback) => {
      const cbs = callback.slice();
      const cb = cbs[0]; // First callback
      cbs.shift();

      cb(data, () => {
        this.fireNext(data, cbs);
      });
    });
  }

  fireNext(data, callbackStack) {
    const cbs = callbackStack.slice();
    const cb = cbs[0];
    cbs.shift();

    if (cb) {
      cb(data, () => {
        this.fireNext(data, cbs);
      });
    }
  }

  GetCallbackCount() {
    return this.callbacks.length;
  }
}

module.exports = DispatcherEvent;
