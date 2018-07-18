import actions, { reducer } from '../ThreadsRedux'
import { Thread, ExternalInvite } from '../../Models/TextileTypes'

const id = 'id'
const name = 'myThread'
const peers = 3
const error = new Error('an error')
const inviteId = 'invite_id'
const inviteKey = 'a_key'
const invite: ExternalInvite = {id: inviteId, inviter: 'tests', key: inviteKey}

const initialState = reducer(undefined, {} as any)

describe('ui stories', () => {
  describe('initial state', () => {
    it('should match snapshot', () => {
      expect(initialState).toMatchSnapshot()
    })
  })
  describe('handling invites', () => {
    it('should succeed at creating an invite', () => {
      const state0 = reducer(initialState, actions.addExternalInviteRequest(id, name))
      const match0 = { id, name }
      expect(state0.outboundInvite).toMatchObject(match0)
      const state1 = reducer(state0, actions.addExternalInviteSuccess(id, name, invite))
      const match1 = { id, name, invite }
      expect(state1.outboundInvite).toMatchObject(match1)
    })
    it('should fail at creating an invite', () => {
      const state0 = reducer(initialState, actions.addExternalInviteRequest(id, name))
      const match0 = { id, name }
      expect(state0.outboundInvite).toMatchObject(match0)
      const state1 = reducer(state0, actions.addExternalInviteError(error))
      const match1 = { id, name, error }
      expect(state1.outboundInvite).toMatchObject(match1)
    })
    it('should succeed at accepting an invite', () => {
      const state0 = reducer(initialState, actions.acceptExternalInviteRequest(inviteId, inviteKey))
      const match0 = { inviteId: inviteId, key:inviteKey }
      expect(state0.inboundInvite).toMatchObject(match0)
      const state1 = reducer(state0, actions.acceptExternalInviteSuccess(id))
      const match1 = { id, inviteId: inviteId, key:inviteKey }
      expect(state1.inboundInvite).toMatchObject(match1)
    })
    it('should fail at accepting an invite', () => {
      const state0 = reducer(initialState, actions.acceptExternalInviteRequest(inviteId, inviteKey))
      const match0 = { inviteId: inviteId, key:inviteKey }
      expect(state0.inboundInvite).toMatchObject(match0)
      const state1 = reducer(state0, actions.acceptExternalInviteError(error))
      const match1 = { inviteId: inviteId, key:inviteKey, error }
      expect(state1.inboundInvite).toMatchObject(match1)
    })
    it('should ignore out of order events', () => {
      const state0 = reducer(initialState, actions.addExternalInviteSuccess(id, name, invite))
      expect(state0).toMatchObject(initialState)
      const state1 = reducer(initialState, actions.addExternalInviteError(error))
      expect(state1).toMatchObject(initialState)
      const state2 = reducer(initialState, actions.acceptExternalInviteSuccess(id))
      expect(state2).toMatchObject(initialState)
      const state3 = reducer(initialState, actions.acceptExternalInviteError(error))
      expect(state3).toMatchObject(initialState)
    })
  })
  describe('adding threads', () => {
    it('should succeed at adding a thread', () => {
      const state0 = reducer(initialState, actions.addThreadRequest(name))
      const match0 = { name }
      expect(state0.adding).toMatchObject(match0)
      const match1: Thread = { id, name, peers }
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
    it('should ignore out of order events', () => {
      const state0 = reducer(initialState, actions.addThreadSuccess({ id, name, peers }))
      expect(state0).toMatchObject(initialState)
      const state1 = reducer(initialState, actions.addThreadError(error))
      expect(state1).toMatchObject(initialState)
    })
  })
  describe('leaving threads', () => {
    it('should leave a thread successfully', () => {
      const state0 = reducer(initialState, actions.addThreadRequest(id))
      const state1 = reducer(state0, actions.addThreadSuccess({ id, name, peers }))
      expect(state1.threadItems).toHaveLength(1)
      const state2 = reducer(state1, actions.removeThreadRequest(id))
      const match2 = { id }
      expect(state2.removing).toMatchObject(match2)
      const state3 = reducer(state2, actions.removeThreadSuccess(id))
      expect(state3.threadItems).toHaveLength(0)
      expect(state3.removing).toBeUndefined()
    })
    it('should fail at leaving a thread', () => {
      const state0 = reducer(initialState, actions.addThreadRequest(id))
      const state1 = reducer(state0, actions.addThreadSuccess({ id, name, peers }))
      const state2 = reducer(state1, actions.removeThreadRequest(id))
      const match2 = { id }
      expect(state2.removing).toMatchObject(match2)
      const state3 = reducer(state2, actions.removeThreadError(error))
      const match3 = { id, error }
      expect(state3.removing).toMatchObject(match3)
      expect(state3.threadItems).toHaveLength(1)
    })
    it('should ignore out of order events', () => {
      const state0 = reducer(initialState, actions.removeThreadSuccess(name))
      expect(state0).toMatchObject(initialState)
      const state1 = reducer(initialState, actions.removeThreadError(error))
      expect(state1).toMatchObject(initialState)
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
