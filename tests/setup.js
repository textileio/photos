import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import TextileNode from './__mocks__/TextileNode' 
import NavigationService from '../App/Services/NavigationService'

// Custom mock APIs for native TextileNode
jest.mock('NativeModules', () => {
    return {
        TextileNode
    }
})

global.fetch = require('jest-fetch-mock')
Enzyme.configure({ adapter: new Adapter() })
