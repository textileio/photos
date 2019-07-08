import * as actions from './actions'
import reducer from './reducer'
import { TextileInstanceState } from './models'

const initialState = reducer(undefined, {} as any)

const onboardingPath = 'newAccount'
const currentPage = 1
const initializationError = 'error'

describe('initialization', () => {
  describe('initial state', () => {
    it('should match snapshot', () => {
      expect(initialState).toMatchSnapshot()
    })
  })
  describe('onboarding flow', () => {
    it('should move to next page', () => {
      const initialCurrentPage = initialState.onboarding.currentPage
      const state0 = reducer(initialState, actions.nextPage())
      expect(state0.onboarding.currentPage).toEqual(initialCurrentPage + 1)
    })
    it('should choose an onboarding path and reset currentPage to 0', () => {
      const state0 = reducer(initialState, actions.setCurrentPage(currentPage))
      expect(state0.onboarding.currentPage).toEqual(currentPage)
      const state1 = reducer(
        state0,
        actions.chooseOnboardingPath(onboardingPath)
      )
      expect(state1.onboarding.path).toEqual(onboardingPath)
      expect(state1.onboarding.currentPage).toEqual(0)
    })
    it('should complete onboarding', () => {
      const state0 = reducer(initialState, actions.onboardingSuccess())
      expect(state0.onboarding.completed).toEqual(true)
    })
  })
  describe('textile account initialization', () => {
    it('should initialize a new account', () => {
      const state0 = reducer(initialState, actions.initializeNewAccount())
      expect(state0.instance.state).toEqual(TextileInstanceState.initializing)
      const state1 = reducer(state0, actions.nodeInitialized())
      expect(state1.instance.state).toEqual(TextileInstanceState.initialized)
    })
    it('should log an error initializing a new account', () => {
      const state0 = reducer(initialState, actions.initializeNewAccount())
      expect(state0.instance.state).toEqual(TextileInstanceState.initializing)
      const state1 = reducer(
        state0,
        actions.failedToInitializeNode(initializationError)
      )
      expect(state1.instance.error).toEqual(initializationError)
    })
  })
})
