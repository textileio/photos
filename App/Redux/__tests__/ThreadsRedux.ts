import actions, { reducer, Thread } from '../ThreadsRedux'

const addId = 'addId'
const id = 'id'
const name = 'myThread'
const peers = 3
const error = new Error('an error')

const initialState = reducer(undefined, {} as any)

describe('ui stories', () => {
  describe('initial state', () => {
    it('should match snapshot', () => {
      expect(initialState).toMatchSnapshot()
    })
  })
  describe('adding threads', () => {
    it('should succeed at adding a thread', () => {
      const state0 = reducer(initialState, actions.addThreadRequest(addId, name))
      const match0: Thread = { addId, state: 'adding' }
      expect(state0.threads[0]).toMatchObject(match0)
      const state1 = reducer(state0, actions.addThreadSuccess(addId, { id, name, peers }))
      const match1: Thread = { state: 'joined', threadItem: { id, name, peers } }
      expect(state1.threads[0]).toMatchObject(match1)
    })
    it('should fail at adding a thread', () => {
      const state0 = reducer(initialState, actions.addThreadRequest(addId, name))
      const match0: Thread = { addId, state: 'adding' }
      expect(state0.threads[0]).toMatchObject(match0)
      const state1 = reducer(state0, actions.addThreadError(addId, error))
      const match1: Thread = { addId, error, state: 'adding' }
      expect(state1.threads[0]).toMatchObject(match1)
    })
  })
  describe('leaving threads', () => {
    it('should leave a thread successfully', () => {
      const state0 = reducer(initialState, actions.addThreadRequest(addId, name))
      const state1 = reducer(state0, actions.addThreadSuccess(addId, { id, name, peers }))
      const state2 = reducer(state1, actions.removeThreadRequest(id))
      const match2: Thread = { state: 'leaving', threadItem: { id, name, peers } }
      expect(state2.threads[0]).toMatchObject(match2)
      const state3 = reducer(state2, actions.removeThreadSuccess(id))
      expect(state3.threads).toHaveLength(0)
    })
    it('should fail at leaving a thread', () => {
      const state0 = reducer(initialState, actions.addThreadRequest(addId, name))
      const state1 = reducer(state0, actions.addThreadSuccess(addId, { id, name, peers }))
      const state2 = reducer(state1, actions.removeThreadRequest(id))
      const match2: Thread = { state: 'leaving', threadItem: { id, name, peers } }
      expect(state2.threads[0]).toMatchObject(match2)
      const state3 = reducer(state2, actions.removeThreadError(id, error))
      const match3: Thread = { state: 'leaving', error, threadItem: { id, name, peers } }
      expect(state3.threads[0]).toMatchObject(match3)
    })
  })
  describe('refreshing threads', () => {
    it('should refresh threads successfully', () => {
      expect(initialState.threads).toHaveLength(0)
      const state0 = reducer(initialState, actions.refreshThreadsRequest())
      expect(state0.refreshing).toEqual(true)
      const state1 = reducer(state0, actions.refreshThreadsSuccess({ 
        items: [
          { id, name, peers },
          { id, name, peers },
          { id, name, peers }
        ]
    }))
      expect(state1.refreshing).toEqual(false)
      expect(state1.threads).toHaveLength(3)
    })
    it('should fail at refreshing threads', () => {
      expect(initialState.threads).toHaveLength(0)
      const state0 = reducer(initialState, actions.refreshThreadsRequest())
      expect(state0.refreshing).toEqual(true)
      const state1 = reducer(state0, actions.refreshThreadsError(error))
      expect(state1.refreshing).toEqual(false)
      expect(state1.threads).toHaveLength(0)
      expect(state1.refreshError).toEqual(error)
    })
  })
})
