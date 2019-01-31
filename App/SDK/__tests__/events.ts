import DeviceEventEmitter from '../__mocks__/DeviceEventEmitter'

jest.mock('react-native', () => {
  return {
    DeviceEventEmitter
  }
})

import * as TextileEvents from '../events'

describe('rn events', () => {
  describe('correctly fire', () => {
    it('serialize in and out to same', async () => {
      expect.assertions(2)
      function callback(payload) {
        expect(payload.previousState).toBe('background')
        expect(payload.newState).toBe('active')
      }
      DeviceEventEmitter.addListener(TextileEvents.keys.appStateChange, callback)
      TextileEvents.appStateChange('background', 'active')
    })
  })
})
