import actions, { reducer, Thread } from '../ThreadsRedux'

const tmpId = 'tmpId'
const id = 'id'
const name = 'myThread'
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
      const state0 = reducer(initialState, actions.addThreadRequest(tmpId, name))
      const match0: Thread = { tmpId, name, state: 'adding' }
      expect(state0.threads[0]).toEqual(match0)
      const state1 = reducer(state0, actions.addThreadSuccess(tmpId, id))
      const match1: Thread = { id, name, state: 'joined' }
      expect(state1.threads[0]).toMatchObject(match1)
    })
    it('should fail at adding a thread', () => {
      const state0 = reducer(initialState, actions.addThreadRequest(tmpId, name))
      const match0: Thread = { tmpId, name, state: 'adding' }
      expect(state0.threads[0]).toEqual(match0)
      const state1 = reducer(state0, actions.addThreadError(tmpId, error))
      const match1: Thread = { tmpId, name, error, state: 'adding' }
      expect(state1.threads[0]).toMatchObject(match1)
    })
  })
  describe('leaving threads', () => {
    it('should leave a thread successfully', () => {
      const state0 = reducer(initialState, actions.addThreadRequest(tmpId, name))
      const state1 = reducer(state0, actions.addThreadSuccess(tmpId, id))
      const state2 = reducer(state1, actions.leaveThreadRequest(id))
      const match2: Thread = { id, name, state: 'leaving' }
      expect(state2.threads[0]).toMatchObject(match2)
      const state3 = reducer(state2, actions.leaveThreadSuccess(id))
      expect(state3.threads).toHaveLength(0)
    })
    it('should fail at leaving a thread', () => {
      const state0 = reducer(initialState, actions.addThreadRequest(tmpId, name))
      const state1 = reducer(state0, actions.addThreadSuccess(tmpId, id))
      const state2 = reducer(state1, actions.leaveThreadRequest(id))
      const match2: Thread = { id, name, state: 'leaving' }
      expect(state2.threads[0]).toMatchObject(match2)
      const state3 = reducer(state2, actions.leaveThreadError(id, error))
      const match3: Thread = { id, name, state: 'leaving', error }
      expect(state3.threads[0]).toMatchObject(match3)
    })
  })
  describe('refreshing threads', () => {
    it('should refresh threads successfully', () => {
      expect(initialState.threads).toHaveLength(0)
      const state0 = reducer(initialState, actions.refreshThreadsRequest())
      expect(state0.refreshing).toEqual(true)
      const state1 = reducer(state0, actions.refreshThreadsSuccess([
        { id, name, state: 'joined' },
        { id, name, state: 'joined' },
        { id, name, state: 'joined' }
      ]))
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
