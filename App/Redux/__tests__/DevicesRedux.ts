import actions, { reducer } from '../DevicesRedux'

const initialState = reducer(undefined, {} as any)

describe('devices stories', () => {
  describe('initial state', () => {
    it('should match snapshot', () => {
      expect(initialState).toMatchSnapshot()
    })
  })
})