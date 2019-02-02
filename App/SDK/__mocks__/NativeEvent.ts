const EventEmitter = require('events')

export default class NativeEventEmitter {
  emitter = new EventEmitter()
  emit = jest.fn((key, payload) => {
    return this.emitter.emit(key, payload)
  })

  addListener = jest.fn((key, callback) => {
    return this.emitter.addListener(key, callback)
  })
}
