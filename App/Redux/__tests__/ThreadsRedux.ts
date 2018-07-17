import actions, { reducer } from '../ThreadsRedux'
import { ThreadItem } from '../../Models/TextileTypes'

const id = 'id'
const name = 'myThread'
const peers = 3
const invite = 'https://link'
const error = new Error('an error')

const initialState = reducer(undefined, {} as any)

describe('ui stories', () => {
  describe('initial state', () => {
    it('should match snapshot', () => {
      expect(initialState).toMatchSnapshot()
    })
  })
  describe('handling invites', () => {
    it('should succeed at creating an invite', () => {
      const state0 = reducer(initialState, actions.addExternalInviteRequest(name, id))
      const match0 = { 'pubKey': id }
      expect(state0.link).toMatchObject(match0)

      const state1 = reducer(state0, actions.addExternalInviteSuccess(id, invite))
      const match1 = { 'pubKey': id, 'link': invite }
      expect(state1.link).toMatchObject(match1)
    })
    it('should succeed at accepting an invite', () => {
      const state0 = reducer(initialState, actions.acceptExternalInviteRequest(invite))
      const match0 = { 'link': invite }
      expect(state0.invite).toMatchObject(match0)

      const state1 = reducer(state0, actions.acceptExternalInviteSuccess())
      expect(state1.invite).toBeUndefined()
    })
  })
  describe('adding threads', () => {
    it('should succeed at adding a thread', () => {
      const state0 = reducer(initialState, actions.addThreadRequest(name))
      const match0 = { name }
      expect(state0.adding).toMatchObject(match0)
      const match1: ThreadItem = { id, name, peers }
      const state1 = reducer(state0, actions.addThreadSuccess(match1))
      expect(state1.threadItems[0]).toMatchObject(match1)
      expect(state1.adding).toBeUndefined()
    })
    it('should fail at adding a thread', () => {
      const state0 = reducer(initialState, actions.addThreadRequest(name))
      const match0 = { name }
      expect(state0.adding).toMatchObject(match0)
      const state1 = reducer(state0, actions.addThreadError(error))
      const match1 = { name, error }
      expect(state1.adding).toMatchObject(match1)
      expect(state1.threadItems).toHaveLength(0)
    })
  })
  describe('leaving threads', () => {
    it('should leave a thread successfully', () => {
      const state0 = reducer(initialState, actions.addThreadRequest(name))
      const state1 = reducer(state0, actions.addThreadSuccess({ id, name, peers }))
      expect(state1.threadItems).toHaveLength(1)
      const state2 = reducer(state1, actions.removeThreadRequest(id))
      const match2 = { threadId: id }
      expect(state2.removing).toMatchObject(match2)
      const state3 = reducer(state2, actions.removeThreadSuccess(id))
      expect(state3.threadItems).toHaveLength(0)
      expect(state3.removing).toBeUndefined()
    })
    it('should fail at leaving a thread', () => {
      const state0 = reducer(initialState, actions.addThreadRequest(name))
      const state1 = reducer(state0, actions.addThreadSuccess({ id, name, peers }))
      const state2 = reducer(state1, actions.removeThreadRequest(id))
      const match2 = { threadId: id }
      expect(state2.removing).toMatchObject(match2)
      const state3 = reducer(state2, actions.removeThreadError(error))
      const match3 = { threadId: id, error }
      expect(state3.removing).toMatchObject(match3)
      expect(state3.threadItems).toHaveLength(1)
    })
  })
  describe('refreshing threads', () => {
    it('should refresh threads successfully', () => {
      expect(initialState.threadItems).toHaveLength(0)
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
      expect(state1.threadItems).toHaveLength(3)
    })
    it('should fail at refreshing threads', () => {
      expect(initialState.threadItems).toHaveLength(0)
      const state0 = reducer(initialState, actions.refreshThreadsRequest())
      expect(state0.refreshing).toEqual(true)
      const state1 = reducer(state0, actions.refreshThreadsError(error))
      expect(state1.refreshing).toEqual(false)
      expect(state1.threadItems).toHaveLength(0)
      expect(state1.refreshError).toEqual(error)
    })
  })
})
