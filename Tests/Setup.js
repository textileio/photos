import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

const EventEmitter = require('EventEmitter');
const RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');

/**
 * Mock the NativeEventEmitter as a normal JS EventEmitter.
 */
class mockNativeEventEmitter extends EventEmitter {
  constructor() {
    super(RCTDeviceEventEmitter.sharedSubscriber)
  }
}

// Mock your external modules here if needed
jest
.mock('react-native-i18n', () => {
  const english = require('../App/I18n/languages/english.json')
  const keys = require('ramda')
  const replace = require('ramda')
  const forEach = require('ramda')

  return {
    t: (key, replacements) => {
      let value = english[key]
      if (!value) return key
      if (!replacements) return value

      forEach((r) => {
        value = replace(`{{${r}}}`, replacements[r], value)
      }, keys(replacements))
      return value
    }
  }
})
.mock('react-native', () => ({
  NativeModules: {
    TextileIPFS: {
      createNodeWithDataDir: jest.fn().mockReturnValue(true)
    }
  },
  Platform: {
    select: () => jest.fn(dict => dict.android)
  },
  NativeEventEmitter: mockNativeEventEmitter
}))
