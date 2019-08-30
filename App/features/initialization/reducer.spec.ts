import * as actions from './actions'
import reducer from './reducer'
import { InitializationStatus } from './models'

const initialState = reducer(undefined, {} as any)

const initializationError = 'error'

describe('initialization', () => {
  describe('initial state', () => {
    it('should match snapshot', () => {
      expect(initialState).toMatchSnapshot()
    })
  })
  describe('textile account initialization', () => {
    it('should initialize a new account', () => {
      const state0 = reducer(initialState, actions.initializeNewAccount())
      const creatingWallet: InitializationStatus = 'creatingWallet'
      expect(state0.instance.state).toEqual(creatingWallet)
      const state1 = reducer(
        state0,
        actions.updateInitializationStatus('initialized')
      )
      const initialized: InitializationStatus = 'initialized'
      expect(state1.instance.state).toEqual(initialized)
    })
    it('should log an error initializing a new account', () => {
      const state0 = reducer(initialState, actions.initializeNewAccount())
      const creatingWallet: InitializationStatus = 'creatingWallet'
      expect(state0.instance.state).toEqual(creatingWallet)
      const state1 = reducer(
        state0,
        actions.failedToInitializeNode(initializationError)
      )
      expect(state1.instance.error).toEqual(initializationError)
    })
  })
})
