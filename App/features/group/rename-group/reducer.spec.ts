import {
  renameGroupReducer as reducer,
  renameGroupActions as actions
} from './'

const threadId1 = 'id1'
const threadId2 = 'id2'
const name1 = 'name1'
const name2 = 'name2'
const error = 'error'
const initialState = reducer(undefined, {} as any)

describe('renaming groups', () => {
  describe('initial state', () => {
    it('should match snapshot', () => {
      expect(initialState).toMatchSnapshot()
    })
  })
  describe('request to rename group', () => {
    it('should manage async renaming the group', () => {
      const state0 = reducer(initialState, actions.renameGroup.request({ threadId: threadId1, name: name1 }))
      expect(state0[threadId1]).toBeDefined()
      const state1 = reducer(state0, actions.renameGroup.success({ threadId: threadId1 }))
      expect(state1[threadId1]).toBeUndefined()
      const state2 = reducer(state1, actions.renameGroup.request({ threadId: threadId2, name: name2 }))
      expect(state2[threadId2]).toBeDefined()
      const state3 = reducer(state2, actions.renameGroup.failure({ threadId: threadId2, error }))
      expect(state3[threadId2].error).toEqual(error)
    })
  })
})
