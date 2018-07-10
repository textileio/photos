import actions, { reducer, Device } from '../DevicesRedux'

const initialState = reducer(undefined, {} as any)

const name = 'deviceName'
const pubKey = 'pubKey'
const error = new Error('an error')

describe('devices stories', () => {
  describe('initial state', () => {
    it('should match snapshot', () => {
      expect(initialState).toMatchSnapshot()
    })
  })
  describe('adding devices', () => {
    it('should add a device', () => {
      const state0 = reducer(initialState, actions.addDeviceRequest({ id: pubKey, name }))
      const match0: Device = { state: 'adding', deviceItem: { id: pubKey, name } }
      expect(state0.devices[0]).toMatchObject(match0)
      const state1 = reducer(state0, actions.addDeviceSuccess(pubKey))
      const match1: Device = { state: 'added', deviceItem: { id: pubKey, name } }
      expect(state1.devices[0]).toMatchObject(match1)
    })
    it('should fail at adding a device', () => {
      const state0 = reducer(initialState, actions.addDeviceRequest({ id: pubKey, name }))
      const match0: Device = { state: 'adding', deviceItem: { id: pubKey, name } }
      expect(state0.devices[0]).toMatchObject(match0)
      const state1 = reducer(state0, actions.addDeviceError(pubKey, error))
      const match1: Device = { error, state: 'adding', deviceItem: { id: pubKey, name } }
      expect(state1.devices[0]).toMatchObject(match1)
    })
  })
  describe('removing devices', () => {
    it('should remove a device', () => {
      const state0 = reducer(initialState, actions.addDeviceRequest({ id: pubKey, name }))
      const state1 = reducer(state0, actions.addDeviceSuccess(pubKey))
      const state2 = reducer(state1, actions.removeDeviceRequest(pubKey))
      const match2: Device = { state: 'removing', deviceItem: { id: pubKey, name} }
      expect(state2.devices[0]).toMatchObject(match2)
      const state3 = reducer(state2, actions.removeDeviceSuccess(pubKey))
      expect(state3.devices).toHaveLength(0)
    })
    it('should fail at removing a device', () => {
      const state0 = reducer(initialState, actions.addDeviceRequest({ id: pubKey, name }))
      const state1 = reducer(state0, actions.addDeviceSuccess(pubKey))
      const state2 = reducer(state1, actions.removeDeviceRequest(pubKey))
      const match2: Device = { state: 'removing', deviceItem: { id: pubKey, name} }
      expect(state2.devices[0]).toMatchObject(match2)
      const state3 = reducer(state2, actions.removeDeviceError(pubKey, error))
      const match3: Device = { error, state: 'removing', deviceItem: { id: pubKey, name} }
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
          { id: pubKey, name },
          { id: pubKey, name },
          { id: pubKey, name }
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
