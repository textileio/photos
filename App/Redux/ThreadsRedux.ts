import { createAction, ActionType, getType } from 'typesafe-actions'
import * as TextileTypes from '../Models/TextileTypes'

const actions = {
  addThreadRequest: createAction('ADD_THREAD_REQUEST', resolve => {
    return (name: string, mnemonic?: string) => resolve({ name, mnemonic })
  }),
  addThreadSuccess: createAction('ADD_THREAD_SUCCESS', resolve => {
    return (thread: TextileTypes.Thread) => resolve({ thread })
  }),
  addThreadError: createAction('ADD_THREAD_ERROR', resolve => {
    return (error: Error) => resolve({ error })
  }),
  removeThreadRequest: createAction('REMOVE_THREAD_REQUEST', resolve => {
    return (id: string) => resolve({ id })
  }),
  removeThreadSuccess: createAction('REMOVE_THREAD_SUCCESS', resolve => {
    return (id: string) => resolve({ id })
  }),
  removeThreadError: createAction('REMOVE_THREAD_ERROR', resolve => {
    return (error: Error) => resolve({ error })
  }),
  refreshThreadsRequest: createAction('REFRESH_THREADS_REQUEST', resolve => {
    return () => resolve()
  }),
  refreshThreadsSuccess: createAction('REFRESH_THREADS_SUCCESS', resolve => {
    return (threads: TextileTypes.Threads) => resolve({ threads })
  }),
  refreshThreadsError: createAction('REFRESH_THREADS_ERROR', resolve => {
    return (error: Error) => resolve({ error })
  }),
  addExternalInviteRequest: createAction('ADD_EXTERNAL_THREAD_INVITE', resolve => {
    return (threadId: string, threadName: string) => resolve({ threadId, threadName })
  }),
  addExternalInviteSuccess: createAction('ADD_EXTERNAL_THREAD_INVITE_SUCCESS', resolve => {
    return (threadId: string, threadName: string, invite: TextileTypes.ExternalInvite) => resolve({ threadId, threadName, invite })
  }),
  addExternalInviteError: createAction('ADD_EXTERNAL_THREAD_INVITE_ERROR', resolve => {
    return (threadId: string, error: Error) => resolve({ threadId, error })
  }),
  acceptExternalInviteRequest: createAction('ACCEPT_EXTERNAL_THREAD_INVITE', resolve => {
    return (inviteId: string, key: string) => resolve({ inviteId, key })
  }),
  acceptExternalInviteSuccess: createAction('ACCEPT_EXTERNAL_THREAD_INVITE_SUCCESS', resolve => {
    return (inviteId: string, id: string) => resolve({inviteId, id})
  }),
  acceptExternalInviteError: createAction('ACCEPT_EXTERNAL_THREAD_INVITE_ERROR', resolve => {
    return (inviteId: string, error: Error) => resolve({ inviteId, error })
  })
}

export type ThreadsAction = ActionType<typeof actions>


export type OutboundInvite = {
  readonly threadId: string
  readonly threadName: string
  readonly invite?: TextileTypes.ExternalInvite
  readonly error?: Error
}

export type InboundInvite = {
  readonly inviteId: string
  readonly key: string
  readonly id?: string
  readonly error?: Error
}

export type ThreadsState = {
  readonly refreshing: boolean
  readonly refreshError?: Error
  readonly adding?: {
    readonly name: string,
    readonly error?: Error
  }
  readonly removing?: {
    readonly id: string
    readonly error?: Error
  }
  // TODO: This single outbound/inboundInvite objects are bad setup and could get wires crossed.
  // e.g. if a user accepts two invites quickly without the first one resolving fully...
  // at the Go layer everything should be fine, but just if we want to build feedback off of this.
  readonly outboundInvites: ReadonlyArray<OutboundInvite>
  readonly inboundInvites: ReadonlyArray<InboundInvite>
  readonly threads: ReadonlyArray<TextileTypes.Thread>
}

export const initialState: ThreadsState = {
  refreshing: false,
  threads: [],
  outboundInvites: [],
  inboundInvites: []
}

export function reducer (state: ThreadsState = initialState, action: ThreadsAction): ThreadsState {
  switch (action.type) {
    case getType(actions.addThreadRequest): {
      const { name } = action.payload
      return { ...state, adding: { name } }
    }
    case getType(actions.addThreadSuccess): {
      if (!state.adding) {
        return state
      }
      const { thread } = action.payload
      const threads = state.threads.concat([thread])
      return { ...state, adding: undefined, threads }
    }
    case getType(actions.addThreadError): {
      if (!state.adding) {
        return state
      }
      const { error } = action.payload
      return { ...state, adding: { ...state.adding, error } }
    }
    case getType(actions.removeThreadRequest): {
      const { id } = action.payload
      return { ...state, removing: { id } }
    }
    case getType(actions.removeThreadSuccess): {
      if (!state.removing) {
        return state
      }
      const { id } = action.payload
      const threads = state.threads.filter(thread => thread.id !== id)
      return { ...state, removing: undefined, threads }
    }
    case getType(actions.removeThreadError): {
      if (!state.removing) {
        return state
      }
      const { error } = action.payload
      return { ...state, removing: { ...state.removing, error } }
    }
    case getType(actions.refreshThreadsRequest):
      return { ...state, refreshing: true, refreshError: undefined }
    case getType(actions.refreshThreadsSuccess):
      const threads = action.payload.threads.items || []
      return { ...state, refreshing: false, refreshError: undefined, threads }
    case getType(actions.refreshThreadsError):
      return { ...state, refreshing: false, refreshError: action.payload.error }
    case getType(actions.addExternalInviteRequest): {
      const { threadId, threadName } = action.payload
      const existing = state.outboundInvites.find(invite => invite.threadId === threadId )
      if (existing && !existing.error) {
        // if the invite already exists and hasn't error'd, return
        return state
      }
      const outboundInvite = { threadId, threadName }
      const outboundInvites = state.outboundInvites.concat([outboundInvite])
      return { ...state, outboundInvites }
    }
    case getType(actions.addExternalInviteSuccess): {
      const { threadId, threadName, invite } = action.payload
      // update the outbound invite with the new Invite object
      const outboundInvites = state.outboundInvites.map(outbound => {
        return outbound.threadId === threadId ? { ...outbound, invite } : outbound
      })
      return { ...state, outboundInvites }
    }
    case getType(actions.addExternalInviteError): {
      const { threadId, error } = action.payload
      // update the outbound invite with the new error
      const outboundInvites = state.outboundInvites.map(outbound => { 
        return outbound.threadId === threadId ? { ...outbound, error } : outbound
      })
      return { ...state, outboundInvites }
    }
    case getType(actions.acceptExternalInviteRequest): {
      // Store the external invite link in memory
      const { inviteId, key } = action.payload
      const existing = state.inboundInvites.find(function (obj) { return obj.inviteId === inviteId })
      if (existing && !existing.error) {
        // if the invite already exists and hasn't error'd, return
        return state
      }
      const inboundInvite = {inviteId, key}
      const inboundInvites = state.inboundInvites.concat([inboundInvite])
      return { ...state, inboundInvites }
    }
    case getType(actions.acceptExternalInviteSuccess): {
      const { inviteId, id } = action.payload
      // update the inbound invite with the new thread id object
      const inboundInvites = state.inboundInvites.map(
        (inbound) => inbound.inviteId === inviteId ? {...inbound, id}
          : inbound
      )
      return { ...state, inboundInvites }
    }
    case getType(actions.acceptExternalInviteError): {
      const { inviteId, error } = action.payload
      // update the inbound invite with the new error
      const inboundInvites = state.inboundInvites.map(
        (outbound) => outbound.inviteId === inviteId ? {...outbound, error}
          : outbound
      )
      return { ...state, inboundInvites }

    }
    default:
      return state
  }
}

export default actions
