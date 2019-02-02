const EventEmitter = require('events')

export default class DeviceEventEmitter {
  emitter = new EventEmitter()
  emit = jest.fn((key: string, payload?: any) => {
    return this.emitter.emit(key, payload)
  })

  addListener = jest.fn((key: string, callback: (payload?: any) => void) => {
    return this.emitter.addListener(key, callback)
  })
}
