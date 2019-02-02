import AsyncStorage from '../__mocks__/AsyncStorage'
import NativeEvent from '../__mocks__/NativeEvent'
import DeviceEvent from '../__mocks__/DeviceEvent'
import AppState from '../__mocks__/AppState'

const DeviceEventEmitter = new DeviceEvent()

jest.mock('react-native', () => {
  return {
      AsyncStorage: new AsyncStorage(),
      DeviceEventEmitter,
      AppState: new AppState()
  }
})



jest.mock('@textile/react-native-sdk', () => {
  return {
      eventEmitter: jest.fn(),
      Events: new NativeEvent()
  }
})

import Textile from '../'
import { NodeState } from '../types'
import { delay } from 'redux-saga';

describe('rn textile', () => {
  describe('stateless functions', () => {
    it('selectors', async () => {
      expect(Textile.appState()).resolves.toEqual('unknown')
      expect(Textile.nodeOnline()).resolves.toEqual(false)
      expect(Textile.nodeState()).resolves.toEqual(NodeState.nonexistent)
    })
  })
  describe('state functions', () => {
    it('startup sequence', async () => {
      expect(Textile.isInitialized()).toEqual(false)
      expect(Textile.setup()).toMatchSnapshot()
      expect(Textile.isInitialized()).toEqual(true)
      await delay(50)
      expect(Textile.appState()).resolves.toEqual('active')
    })
  })
})
