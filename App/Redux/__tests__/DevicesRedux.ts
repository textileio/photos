import actions, { reducer, DeviceItem } from '../DevicesRedux'

const initialState = reducer(undefined, {} as any)

const requestId = 'requestId'
const name = 'deviceName'
const pubKey = 'pubKey'
const id = 'id'
const error = new Error('an error')

describe('devices stories', () => {
  describe('initial state', () => {
    it('should match snapshot', () => {
      expect(initialState).toMatchSnapshot()
    })
  })
  describe('adding devices', () => {
    it('should add a device', () => {
      const state0 = reducer(initialState, actions.addDeviceRequest(requestId, name, pubKey))
      const match0: DeviceItem = { requestId, name, state: 'adding' }
      expect(state0.devices[0]).toMatchObject(match0)
      const state1 = reducer(state0, actions.addDeviceSuccess(requestId, id))
      const match1: DeviceItem = { id, name, state: 'added' }
      expect(state1.devices[0]).toMatchObject(match1)
    })
    it('should fail at adding a device', () => {
      const state0 = reducer(initialState, actions.addDeviceRequest(requestId, name, pubKey))
      const match0: DeviceItem = { requestId, name, state: 'adding' }
      expect(state0.devices[0]).toMatchObject(match0)
      const state1 = reducer(state0, actions.addDeviceError(requestId, error))
      const match1: DeviceItem = { requestId, name, error, state: 'adding' }
      expect(state1.devices[0]).toMatchObject(match1)
    })
  })
  describe('removing devices', () => {
    it('should remove a device', () => {
      const state0 = reducer(initialState, actions.addDeviceRequest(requestId, name, pubKey))
      const state1 = reducer(state0, actions.addDeviceSuccess(requestId, id))
      const state2 = reducer(state1, actions.removeDeviceRequest(id))
      const match2: DeviceItem = { id, name, state: 'removing' }
      expect(state2.devices[0]).toMatchObject(match2)
      const state3 = reducer(state2, actions.removeDeviceSuccess(id))
      expect(state3.devices).toHaveLength(0)
    })
    it('should fail at removing a device', () => {
      const state0 = reducer(initialState, actions.addDeviceRequest(requestId, name, pubKey))
      const state1 = reducer(state0, actions.addDeviceSuccess(requestId, id))
      const state2 = reducer(state1, actions.removeDeviceRequest(id))
      const match2: DeviceItem = { id, name, state: 'removing' }
      expect(state2.devices[0]).toMatchObject(match2)
      const state3 = reducer(state2, actions.removeDeviceError(id, error))
      const match3: DeviceItem = { id, name, error, state: 'removing' }
      expect(state3.devices[0]).toMatchObject(match3)
    })
  })
  describe('refreshing devices', () => {
    it('should refresh devices successfully', () => {
      expect(initialState.devices).toHaveLength(0)
      const state0 = reducer(initialState, actions.refreshDevicesRequest())
      expect(state0.refreshing).toEqual(true)
      const state1 = reducer(state0, actions.refreshDevicesSuccess({ 
        items: [
          { id, name, state: 'added' },
          { id, name, state: 'added' },
          { id, name, state: 'added' }
        ]
    }))
      expect(state1.refreshing).toEqual(false)
      expect(state1.devices).toHaveLength(3)
    })
    it('should fail at refreshing devices', () => {
      expect(initialState.devices).toHaveLength(0)
      const state0 = reducer(initialState, actions.refreshDevicesRequest())
      expect(state0.refreshing).toEqual(true)
      const state1 = reducer(state0, actions.refreshDevicesError(error))
      expect(state1.refreshing).toEqual(false)
      expect(state1.devices).toHaveLength(0)
      expect(state1.refreshError).toEqual(error)
    })
  })
})
