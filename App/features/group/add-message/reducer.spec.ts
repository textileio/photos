import {
  addMessageReducer as reducer,
  addMessageActions as actions
} from './'

const id1 = 'id1'
const id2 = 'id2'
const groupId1 = 'groupId1'
const groupId2 = 'groupId2'
const body = 'body'
const error = 'error'
const initialState = reducer(undefined, {} as any)

describe('processing messages', () => {
  describe('initial state', () => {
    it('should match snapshot', () => {
      expect(initialState).toMatchSnapshot()
    })
  })
  describe('adding message', () => {
    it('should manage async adding of messages', () => {
      const state0 = reducer(initialState, actions.addMessage.request({ id: id1, groupId: groupId1, body }))
      expect(state0.groups[groupId1]).toBeDefined()
      expect(state0.groups[groupId1]![id1]).toBeDefined()
      expect(state0.groups[groupId1]![id1].body).toEqual(body)
      expect(state0.groups[groupId1]![id1].error).toBeUndefined()
      const state1 = reducer(state0, actions.addMessage.request({ id: id2, groupId: groupId1, body }))
      expect(state1.groups[groupId1]).toBeDefined()
      expect(state1.groups[groupId1]![id1]).toBeDefined()
      expect(state1.groups[groupId1]![id2]).toBeDefined()
      const state2 = reducer(state1, actions.addMessage.request({ id: id1, groupId: groupId2, body }))
      expect(state2.groups[groupId1]).toBeDefined()
      expect(state2.groups[groupId1]![id1]).toBeDefined()
      expect(state2.groups[groupId1]![id2]).toBeDefined()
      expect(state2.groups[groupId2]).toBeDefined()
      expect(state2.groups[groupId2]![id1]).toBeDefined()
      const state3 = reducer(state2, actions.addMessage.success({ id: id1, groupId: groupId1 }))
      expect(state3.groups[groupId1]).toBeDefined()
      expect(state3.groups[groupId1]![id1]).toBeUndefined()
      expect(state3.groups[groupId1]![id2]).toBeDefined()
      expect(state2.groups[groupId2]).toBeDefined()
      expect(state3.groups[groupId2]![id1]).toBeDefined()
      const state4 = reducer(state3, actions.addMessage.success({ id: id2, groupId: groupId1 }))
      expect(state4.groups[groupId1]).toBeDefined()
      expect(state4.groups[groupId1]![id1]).toBeUndefined()
      expect(state4.groups[groupId1]![id2]).toBeUndefined()
      expect(state2.groups[groupId2]).toBeDefined()
      expect(state4.groups[groupId2]![id1]).toBeDefined()
      const state5 = reducer(state4, actions.addMessage.failure({ id: id1, groupId: groupId2, error }))
      expect(state5.groups[groupId1]).toBeDefined()
      expect(state5.groups[groupId1]![id1]).toBeUndefined()
      expect(state5.groups[groupId1]![id2]).toBeUndefined()
      expect(state5.groups[groupId2]).toBeDefined()
      expect(state5.groups[groupId2]![id1]).toBeDefined()
      expect(state5.groups[groupId2]![id1].error).toEqual(error)
    })
  })
})
