import actions, { reducer } from '../PreferencesRedux'

const initialState = reducer(undefined, {} as any)

describe('preferences stories', () => {
  describe('initial state', () => {
    it('should match snapshot', () => {
      expect(initialState).toMatchSnapshot()
    })
  })
  describe('tour screens', () => {
    it('wallet should be viewed', () => {
      expect(initialState.tourScreens.wallet).toBe(true)
      const state = reducer(initialState, actions.completeTourSuccess('wallet'))
      expect(state.tourScreens.wallet).toBe(false)
    })
  })
  describe('verbose ui', () => {
    it('should toggle', () => {
      expect(initialState.verboseUi).toBe(false)
      const state0 = reducer(initialState, actions.toggleVerboseUi())
      expect(state0.verboseUi).toBe(true)
      const state1 = reducer(state0, actions.toggleVerboseUi())
      expect(state1.verboseUi).toBe(false)
    })
  })
})
