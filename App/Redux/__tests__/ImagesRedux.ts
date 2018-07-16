import actions, { reducer } from '../ImagesRedux'

const initialState = reducer(undefined, {} as any)

describe('images stories', () => {
  describe('initial state', () => {
    it('should match snapshot', () => {
      expect(initialState).toMatchSnapshot()
    })
  })
})