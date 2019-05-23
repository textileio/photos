import {
  renameGroupReducer as reducer,
  renameGroupActions as actions
} from './'

const threadId = 'id'
const name = 'name'
const initialState = reducer(undefined, {} as any)

describe('renaming groups', () => {
  describe('initial state', () => {
    it('should match snapshot', () => {
      expect(initialState).toMatchSnapshot()
    })
  })
  describe('request to rename group', () => {
    it('should manage async renaming the group', () => {
      const state0 = reducer(initialState, actions.renameGroup.request({ threadId, name }))
      expect(state0[threadId]).toBeDefined()
      const state1 = reducer(state0, actions.renameGroup.success)
      expect(state0[threadId]).toBeUndefined()
    })
  })
})
