import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import TextileNode from './__mocks__/TextileNode'

// Custom mock APIs for native TextileNode
jest.mock('NativeModules', () => {
    return {
        TextileNode
    }
})

jest.mock('@textile/react-native-sdk', () => {
    return {
        eventEmitter: jest.fn()
    }
})

jest.mock('CameraRoll', () => {
    return {
        getPhotos: jest.fn((payload) => new Promise((resolve) => {
            // TODO: do something meaningful with first
            // const { first } = payload
            resolve({
                edges: [
                    {
                        node: {
                            image: {
                                uri: '/disk/uri'
                            }
                        }
                    }
                ]
            })
        }))
    }
})

global.fetch = require('jest-fetch-mock')
Enzyme.configure({ adapter: new Adapter() })
