import { createAction, ActionType, getType } from 'typesafe-actions'

const actions = {
  addDeviceRequest: createAction('ADD_DEVICE_REQUEST', resolve => {
    return (requestId: string, name: string, pubKey: string) => resolve({ requestId, name, pubKey })
  }),
  addDeviceSuccess: createAction('ADD_DEVICE_SUCCESS', resolve => {
    return (requestId: string, id: string) => resolve({ requestId, id })
  }),
  addDeviceError: createAction('ADD_DEVICE_ERROR', resolve => {
    return (requestId: string, error: Error) => resolve({ requestId, error })
  }),
  removeDeviceRequest: createAction('REMOVE_DEVICE_REQUEST', resolve => {
    return (id: string) => resolve({ id })
  }),
  removeDeviceSuccess: createAction('REMOVE_DEVICE_SUCCESS', resolve => {
    return (id: string) => resolve({ id })
  }),
  removeDeviceError: createAction('REMOVE_DEVICE_ERROR', resolve => {
    return (id: string, error: Error) => resolve({ id, error })
  }),
  refreshDevicesRequest: createAction('REFRESH_DEVICES_REQUEST', resolve => {
    return () => resolve()
  }),
  refreshDevicesSuccess: createAction('REFRESH_DEVICES_SUCCESS', resolve => {
    return (devices: Devices) => resolve({ devices })
  }),
  refreshDevicesError: createAction('REFRESH_DEVICES_ERROR', resolve => {
    return (error: Error) => resolve({ error })
  })
}

export type DevicesAction = ActionType<typeof actions>

export type DeviceItem = {
  readonly id?: string,
  readonly name: string,
  readonly requestId?: string
  readonly state: 'adding' | 'added' | 'removing'
  readonly error?: Error
}

export type Devices = {
  readonly items: ReadonlyArray<DeviceItem>
}

export type DevicesState = {
  readonly refreshing: boolean
  readonly refreshError?: Error
  readonly devices: ReadonlyArray<DeviceItem>
}

export const initialState: DevicesState = {
  refreshing: false,
  devices: []
}

export function reducer (state: DevicesState = initialState, action: DevicesAction): DevicesState {
  switch (action.type) {
    case getType(actions.addDeviceRequest): {
      const { requestId, name } = action.payload
      const devices = state.devices.concat([{ name, requestId, state: 'adding' }])
      return { ...state, devices }
    }
    case getType(actions.addDeviceSuccess): {
      const { requestId, id } = action.payload
      const devices = state.devices.map(device => {
        if (device.requestId === requestId) {
          const updatedDevice: DeviceItem = { ...device, id, state: 'added' }
          return updatedDevice
        } else {
          return device
        }
      })
      return { ...state, devices }
    }
    case getType(actions.addDeviceError): {
      const { requestId, error } = action.payload
      const devices = state.devices.map(device => {
        if (device.requestId === requestId) {
          const updatedDevice: DeviceItem = { ...device, error }
          return updatedDevice
        } else {
          return device
        }
      })
      return { ...state, devices }
    }
    case getType(actions.removeDeviceRequest): {
      const { id } = action.payload
      const devices = state.devices.map(device => {
        if (device.id === id) {
          const updatedDevice: DeviceItem = { ...device, state: 'removing' }
          return updatedDevice
        } else {
          return device
        }
      })
      return { ...state, devices }
    }
    case getType(actions.removeDeviceSuccess): {
      const { id } = action.payload
      const devices = state.devices.filter(device => device.id !== id )
      return { ...state, devices }
    }
    case getType(actions.removeDeviceError): {
      const { id, error } = action.payload
      const devices = state.devices.map(device => {
        if (device.id === id) {
          const updatedDevice: DeviceItem = { ...device, error }
          return updatedDevice
        } else {
          return device
        }
      })
      return { ...state, devices }
    }
    case getType(actions.refreshDevicesRequest):
      return { ...state, refreshing: true, refreshError: undefined }
    case getType(actions.refreshDevicesSuccess):
      return { ...state, refreshing: false, refreshError: undefined, devices: action.payload.devices.items }
    case getType(actions.refreshDevicesError):
      return { ...state, refreshing: false, refreshError: action.payload.error }
    default:
      return state
  }
}

export default actions
