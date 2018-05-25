import { configure } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import {
  mockNativeEventEmitter,
  mockTextileIPFS
} from './Mocks/MockTextileIPFSNativeModules'

configure({ adapter: new Adapter() })

jest
.mock('react-native', () => ({
  NativeModules: {
    TextileIPFS: mockTextileIPFS
  },
  Platform: {
    // TODO: For now just always pick ios?
    select: jest.fn(dict => dict.ios)
  },
  NativeEventEmitter: mockNativeEventEmitter
}))
