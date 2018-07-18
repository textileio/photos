import { createAction, ActionType, getType } from 'typesafe-actions'
import * as TextileTypes from '../Models/TextileTypes'

const actions = {
  addThreadRequest: createAction('ADD_THREAD_REQUEST', resolve => {
    return (name: string, mnemonic?: string) => resolve({ name, mnemonic })
  }),
  addThreadSuccess: createAction('ADD_THREAD_SUCCESS', resolve => {
    return (threadItem: TextileTypes.ThreadItem) => resolve({ threadItem })
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
    return (id: string, name: string) => resolve({ threadId: id, name })
  }),
  addExternalInviteSuccess: createAction('ADD_EXTERNAL_THREAD_INVITE_SUCCESS', resolve => {
    // TODO this is the return from Go, we need a ThreadExternalInvite type
    // ExternalInvite{
    //   Id:     string,
    //     Key:     string,
    //     Inviter: string,
    // }
    return (invite: TextileTypes.ExternalInvite) => resolve({ invite })
  }),
  addExternalInviteError: createAction('ADD_EXTERNAL_THREAD_INVITE_ERROR', resolve => {
    return (error: Error) => resolve({ error })
  }),
  acceptExternalInviteRequest: createAction('ACCEPT_EXTERNAL_THREAD_INVITE', resolve => {
    return (id: string, key: string) => resolve({ id, key })
  }),
  acceptExternalInviteSuccess: createAction('ACCEPT_EXTERNAL_THREAD_INVITE_SUCCESS', resolve => {
    return (threadId: string) => resolve({threadId})
  }),
  acceptExternalInviteError: createAction('ACCEPT_EXTERNAL_THREAD_INVITE_ERROR', resolve => {
    return (error: Error) => resolve({ error })
  })
}

export type ThreadsAction = ActionType<typeof actions>

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
  readonly outboundInvite?: {
    readonly threadId: string
    readonly name: string
    readonly key?: string // invite key
    readonly id?: string // invite id
    readonly inviter?: string
    readonly error?: Error
  }
  readonly inboundInvite?: {
    readonly id: string
    readonly key: string
    readonly threadId?: string
    readonly error?: Error
  }
  readonly threadItems: ReadonlyArray<TextileTypes.ThreadItem>
}

export const initialState: ThreadsState = {
  refreshing: false,
  threadItems: []
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
      const { threadItem } = action.payload
      const threadItems = state.threadItems.concat([threadItem])
      return { ...state, adding: undefined, threadItems }
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
      const threadItems = state.threadItems.filter(thread => thread.id !== id)
      return { ...state, removing: undefined, threadItems }
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
      const threadItems = action.payload.threads.items || []
      return { ...state, refreshing: false, refreshError: undefined, threadItems }
    case getType(actions.refreshThreadsError):
      return { ...state, refreshing: false, refreshError: action.payload.error }
    case getType(actions.addExternalInviteRequest): {
      // Store the link request pubKey in memory (name will be deprecated)
      const { threadId, name } = action.payload
      return { ...state, outboundInvite: { threadId, name } }
    }
    case getType(actions.addExternalInviteSuccess): {
      if (!state.outboundInvite) {
        return state
      }
      const { invite } = action.payload
      return { ...state, outboundInvite: { ...state.outboundInvite, id: invite.Id, key: invite.Key, inviter: invite.Inviter } }
    }
    case getType(actions.addExternalInviteError): {
      // Remove any pending link requests from memory
      if (!state.outboundInvite) {
        return state
      }
      const { error } = action.payload
      return { ...state, outboundInvite: { ...state.outboundInvite, error } }
    }
    case getType(actions.acceptExternalInviteRequest): {
      // Store the external invite link in memory
      const { id, key } = action.payload
      return { ...state, inboundInvite: { id, key } }
    }
    case getType(actions.acceptExternalInviteSuccess): {
      if (!state.inboundInvite) {
        return state
      }
      const { threadId } = action.payload
      return { ...state, inboundInvite: {...state.inboundInvite, threadId} }
    }
    case getType(actions.acceptExternalInviteError): {
      if (!state.inboundInvite) {
        return state
      }
      const { error } = action.payload
      return { ...state, inboundInvite: { ...state.inboundInvite, error } }
    }
    default:
      return state
  }
}

export default actions
