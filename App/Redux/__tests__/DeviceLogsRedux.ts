import actions, { reducer } from '../DeviceLogsRedux'

const initialState = reducer(undefined, {} as any)

describe('device logs stories', () => {
  describe('initial state', () => {
    it('should match initial state', () => {
      expect(initialState).toMatchSnapshot()
    })
  })
  describe('adding a log entry', () => {
    it('should initially be empty', () => {
      expect(initialState.logs.length).toEqual(0)
    })
    it('should log an entry', () => {
      const state0 = reducer(initialState, actions.logNewEvent(0, 'event', 'message', false))
      expect(state0.logs.length).toEqual(1)
    })
  })
})
