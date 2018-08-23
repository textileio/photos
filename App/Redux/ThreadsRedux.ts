import { createAction, ActionType, getType } from 'typesafe-actions'
import * as TT from '../Models/TextileTypes'
import { RootState } from '../Redux/Types'

const actions = {
  addThreadRequest: createAction('ADD_THREAD_REQUEST', resolve => {
    return (name: TT.ThreadName, mnemonic?: TT.Mnemonic) => resolve({ name, mnemonic })
  }),
  addThreadSuccess: createAction('ADD_THREAD_SUCCESS', resolve => {
    return (thread: TT.Thread) => resolve({ thread })
  }),
  addThreadError: createAction('ADD_THREAD_ERROR', resolve => {
    return (error: Error) => resolve({ error })
  }),
  removeThreadRequest: createAction('REMOVE_THREAD_REQUEST', resolve => {
    return (id: TT.ThreadId) => resolve({ id })
  }),
  removeThreadSuccess: createAction('REMOVE_THREAD_SUCCESS', resolve => {
    return (id: TT.ThreadId) => resolve({ id })
  }),
  removeThreadError: createAction('REMOVE_THREAD_ERROR', resolve => {
    return (error: Error) => resolve({ error })
  }),
  refreshThreadsRequest: createAction('REFRESH_THREADS_REQUEST', resolve => {
    return () => resolve()
  }),
  refreshThreadsSuccess: createAction('REFRESH_THREADS_SUCCESS', resolve => {
    return (threads: TT.Threads) => resolve({ threads })
  }),
  refreshThreadsError: createAction('REFRESH_THREADS_ERROR', resolve => {
    return (error: Error) => resolve({ error })
  }),
  addExternalInviteRequest: createAction('ADD_EXTERNAL_THREAD_INVITE', resolve => {
    return (id: TT.ThreadId, name: TT.ThreadName) => resolve({ id, name })
  }),
  addExternalInviteSuccess: createAction('ADD_EXTERNAL_THREAD_INVITE_SUCCESS', resolve => {
    return (id: TT.ThreadId, name: TT.ThreadName, invite: TT.ExternalInvite) => resolve({ id, name, invite })
  }),
  addExternalInviteError: createAction('ADD_EXTERNAL_THREAD_INVITE_ERROR', resolve => {
    return (id: TT.ThreadId, error: Error) => resolve({ id, error })
  }),
  acceptExternalInviteRequest: createAction('ACCEPT_EXTERNAL_THREAD_INVITE', resolve => {
    return (inviteId: TT.BlockId, key: TT.PrivateKey, name?: TT.ThreadName, inviter?: TT.UserName) => resolve({ inviteId, key, name, inviter })
  }),
  acceptExternalInviteSuccess: createAction('ACCEPT_EXTERNAL_THREAD_INVITE_SUCCESS', resolve => {
    return (inviteId: TT.BlockId, id: TT.ThreadId) => resolve({inviteId, id})
  }),
  acceptExternalInviteError: createAction('ACCEPT_EXTERNAL_THREAD_INVITE_ERROR', resolve => {
    return (inviteId: TT.BlockId, error: Error) => resolve({ inviteId, error })
  }),
  storeExternalInviteLink: createAction('STORE_EXTERNAL_INVITE_LINK', resolve => {
    return (link: string) => resolve({ link })
  }),
  removeExternalInviteLink: createAction('REMOVE_EXTERNAL_INVITE_LINK', resolve => {
    return () => resolve()
  }),
  acceptInviteRequest: createAction('ACCEPT_THREAD_INVITE', resolve => {
    return (notificationId: TT.NotificationId, threadName: TT.ThreadName) => resolve({ notificationId, threadName  })
  }),
  addInternalInvitesRequest: createAction('ADD_INTERNAL_INVITES_REQUEST', resolve => {
    return (threadId: TT.ThreadId, inviteePks: TT.PublicKey[]) => resolve({ threadId, inviteePks  })
  }),
}

export type ThreadsAction = ActionType<typeof actions>


export type OutboundInvite = {
  readonly id: TT.ThreadId
  readonly name: TT.ThreadName
  readonly invite?: TT.ExternalInvite
  readonly error?: Error
}

export type InboundInvite = {
  readonly inviteId: TT.BlockId
  readonly key: TT.PrivateKey
  readonly id?: TT.ThreadId
  readonly name?: TT.ThreadName
  readonly inviter?: TT.UserName
  readonly error?: Error
}

export type ThreadsState = {
  readonly refreshing: boolean
  readonly refreshError?: Error
  readonly adding?: {
    readonly name: TT.ThreadName,
    readonly error?: Error
  }
  readonly removing?: {
    readonly id: TT.ThreadId
    readonly error?: Error
  }
  readonly outboundInvites: ReadonlyArray<OutboundInvite>
  readonly inboundInvites: ReadonlyArray<InboundInvite>
  readonly threads: ReadonlyArray<TT.Thread>
  readonly pendingInviteLink?: string // used to hold an invite if triggered before login
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
      const { id, name } = action.payload
      const existing = state.outboundInvites.find(invite => invite.id === id )
      if (existing && !existing.error) {
        // if the invite already exists and hasn't error'd, return
        return state
      }
      const outboundInvite = { id, name }
      const outboundInvites = state.outboundInvites.filter(inv => inv.id != id).concat([outboundInvite])
      return { ...state, outboundInvites }
    }
    case getType(actions.addExternalInviteSuccess): {
      const { id, invite } = action.payload
      // update the outbound invite with the new Invite object
      const outboundInvites = state.outboundInvites.map(outbound => {
        return outbound.id === id ? { ...outbound, invite } : outbound
      })
      return { ...state, outboundInvites }
    }
    case getType(actions.addExternalInviteError): {
      const { id, error } = action.payload
      // update the outbound invite with the new error
      const outboundInvites = state.outboundInvites.map(outbound => {
        return outbound.id === id ? { ...outbound, error } : outbound
      })
      return { ...state, outboundInvites }
    }
    case getType(actions.acceptExternalInviteRequest): {
      // Store the external invite link in memory
      const { inviteId, key, name, inviter } = action.payload
      const existing = state.inboundInvites.find(function (obj) { return obj.inviteId === inviteId })
      if (existing && !existing.error) {
        // if the invite already exists and hasn't error'd, return
        return state
      }
      const inboundInvite = {inviteId, key, name, inviter}
      const inboundInvites = state.inboundInvites.filter(inv => inv.inviteId != inviteId).concat([inboundInvite])
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
    case getType(actions.storeExternalInviteLink):
      return { ...state, pendingInviteLink: action.payload.link }
    case getType(actions.removeExternalInviteLink):
      return { ...state, pendingInviteLink: undefined }
    default:
      return state
  }
}

export const ThreadsSelectors = {
  threads: (state: RootState): ThreadsState => state.threads,
  threadById: (state: RootState, id: string): TT.Thread | undefined => state.threads.threads.find((thread: TT.Thread) => thread.id === id),
  threadByName: (state: RootState, name: string): TT.Thread | undefined => state.threads.threads.find((thread: TT.Thread) => thread.name === name)
}

export default actions
