import actions, { reducer } from '../ThreadsRedux'
import {
  BlockId,
  ExternalInvite,
  PrivateKey,
  ThreadId,
  ThreadName,
  UserName
} from '../../Models/TextileTypes'

const id = 'id' as ThreadId
const name = 'myThread' as ThreadName
const error = new Error('an error')
const inviteId = 'invite_id' as BlockId
const inviteKey = 'a_key' as PrivateKey
const invite: ExternalInvite = {id: inviteId, inviter: 'tests' as UserName, key: inviteKey}

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
      const match0 = [{ id, name }]
      expect(state0.outboundInvites).toMatchObject(match0)
      const state1 = reducer(state0, actions.addExternalInviteSuccess(id, name, invite))
      const match1 = [{ id, name, invite }]
      expect(state1.outboundInvites).toMatchObject(match1)
    })
    it('should fail at creating an invite', () => {
      const state0 = reducer(initialState, actions.addExternalInviteRequest(id, name))
      const match0 = [{ id, name }]
      expect(state0.outboundInvites).toMatchObject(match0)
      const state1 = reducer(state0, actions.addExternalInviteError(id, error))
      const match1 = [{ id, name, error }]
      expect(state1.outboundInvites).toMatchObject(match1)
    })
    it('should succeed at accepting an invite', () => {
      const state0 = reducer(initialState, actions.acceptExternalInviteRequest(inviteId, inviteKey))
      const match0 = [{ inviteId, key: inviteKey }]
      expect(state0.inboundInvites).toMatchObject(match0)
      const state1 = reducer(state0, actions.acceptExternalInviteSuccess(inviteId, id))
      const match1 = [{ id, inviteId, key: inviteKey }]
      expect(state1.inboundInvites).toMatchObject(match1)
    })
    it('should fail at accepting an invite', () => {
      const state0 = reducer(initialState, actions.acceptExternalInviteRequest(inviteId, inviteKey))
      const match0 = [{ inviteId, key: inviteKey }]
      expect(state0.inboundInvites).toMatchObject(match0)
      const state1 = reducer(state0, actions.acceptExternalInviteError(inviteId, error))
      const match1 = [{ inviteId, key: inviteKey, error }]
      expect(state1.inboundInvites).toMatchObject(match1)
    })
    it('should ignore out of order events', () => {
      const state0 = reducer(initialState, actions.addExternalInviteSuccess(id, name, invite))
      expect(state0).toMatchObject(initialState)
      const state1 = reducer(initialState, actions.addExternalInviteError(id, error))
      expect(state1).toMatchObject(initialState)
      const state2 = reducer(initialState, actions.acceptExternalInviteSuccess(inviteId, id))
      expect(state2).toMatchObject(initialState)
      const state3 = reducer(initialState, actions.acceptExternalInviteError(inviteId, error))
      expect(state3).toMatchObject(initialState)
    })
  })
})
