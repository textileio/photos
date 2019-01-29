import {
  DeviceEventEmitter
} from 'react-native'

export function * startNodeFinished () {
  DeviceEventEmitter.emit('@textile/startNodeFinished')
}

export function * stopNodeAfterDelayStarting () {
  DeviceEventEmitter.emit('@textile/stopNodeAfterDelayStarting')
}

export function * stopNodeAfterDelayCancelled () {
  DeviceEventEmitter.emit('@textile/stopNodeAfterDelayCancelled')
}

export function * stopNodeAfterDelayFinishing () {
  DeviceEventEmitter.emit('@textile/stopNodeAfterDelayFinishing')
}

export function * stopNodeAfterDelayComplete () {
  DeviceEventEmitter.emit('@textile/stopNodeAfterDelayComplete')
}
export function * appStateChange (previousState: string, newState: string) {
  DeviceEventEmitter.emit('@textile/appStateChange', {previousState, newState})
}
export function * newErrorMessage (error: string) {
  DeviceEventEmitter.emit('@textile/newErrorMessage', {error})
}
