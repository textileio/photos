import actions, { reducer, DeviceWithState } from '../DevicesRedux'
import { DeviceId, DeviceName } from '../../Models/TextileTypes'

const initialState = reducer(undefined, {} as any)

const name: DeviceName = 'deviceName' as any
const deviceId: DeviceId = 'someid' as any
const error = new Error('an error')

describe('devices stories', () => {
  describe('initial state', () => {
    it('should match snapshot', () => {
      expect(initialState).toMatchSnapshot()
    })
  })
  describe('adding devices', () => {
    it('should add a device', () => {
      const state0 = reducer(initialState, actions.addDeviceRequest(name, deviceId))
      const match0: DeviceWithState = { state: 'adding', deviceItem: { id: deviceId, name } }
      expect(state0.devices[0]).toMatchObject(match0)
      const state1 = reducer(state0, actions.addDeviceSuccess(deviceId))
      const match1: DeviceWithState = { state: 'added', deviceItem: { id: deviceId, name } }
      expect(state1.devices[0]).toMatchObject(match1)
    })
    it('should fail at adding a device', () => {
      const state0 = reducer(initialState, actions.addDeviceRequest(name, deviceId))
      const match0: DeviceWithState = { state: 'adding', deviceItem: { id: deviceId, name } }
      expect(state0.devices[0]).toMatchObject(match0)
      const state1 = reducer(state0, actions.addDeviceError(deviceId, error))
      const match1: DeviceWithState = { error, state: 'adding', deviceItem: { id: deviceId, name } }
      expect(state1.devices[0]).toMatchObject(match1)
    })
  })
  describe('removing devices', () => {
    it('should remove a device', () => {
      const state0 = reducer(initialState, actions.addDeviceRequest(name, deviceId))
      const state1 = reducer(state0, actions.addDeviceSuccess(deviceId))
      const state2 = reducer(state1, actions.removeDeviceRequest(deviceId))
      const match2: DeviceWithState = { state: 'removing', deviceItem: { id: deviceId, name} }
      expect(state2.devices[0]).toMatchObject(match2)
      const state3 = reducer(state2, actions.removeDeviceSuccess(deviceId))
      expect(state3.devices).toHaveLength(0)
    })
    it('should fail at removing a device', () => {
      const state0 = reducer(initialState, actions.addDeviceRequest(name, deviceId))
      const state1 = reducer(state0, actions.addDeviceSuccess(deviceId))
      const state2 = reducer(state1, actions.removeDeviceRequest(deviceId))
      const match2: DeviceWithState = { state: 'removing', deviceItem: { id: deviceId, name} }
      expect(state2.devices[0]).toMatchObject(match2)
      const state3 = reducer(state2, actions.removeDeviceError(deviceId, error))
      const match3: DeviceWithState = { error, state: 'removing', deviceItem: { id: deviceId, name} }
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
          { id: deviceId, name },
          { id: deviceId, name },
          { id: deviceId, name }
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
