import { createAction, ActionType, getType } from 'typesafe-actions'
import {
  BlockId,
  ExternalInvite,
  NotificationId,
  PrivateKey,
  PublicKey,
  ThreadId,
  ThreadName,
  UserName
} from '../Models/TextileTypes'
import { RootState } from './Types'

const actions = {
  addExternalInviteRequest: createAction('ADD_EXTERNAL_THREAD_INVITE', (resolve) => {
    return (id: ThreadId, name: ThreadName) => resolve({ id, name })
  }),
  addExternalInviteSuccess: createAction('ADD_EXTERNAL_THREAD_INVITE_SUCCESS', (resolve) => {
    return (id: ThreadId, name: ThreadName, invite: ExternalInvite) => resolve({ id, name, invite })
  }),
  addExternalInviteError: createAction('ADD_EXTERNAL_THREAD_INVITE_ERROR', (resolve) => {
    return (id: ThreadId, error: Error) => resolve({ id, error })
  }),
  threadQRCodeRequest: createAction('THREAD_INVITE_QR_REQUEST', (resolve) => {
    return (id: ThreadId, name: ThreadName) => resolve({ id, name })
  }),
  threadQRCodeSuccess: createAction('THREAD_INVITE_QR_SUCCESS', (resolve) => {
    return (id: ThreadId, name: ThreadName, link: string) => resolve({ id, name, link })
  }),
  acceptExternalInviteRequest: createAction('ACCEPT_EXTERNAL_THREAD_INVITE', (resolve) => {
    return (inviteId: BlockId, key: PrivateKey, name?: ThreadName, inviter?: UserName) => resolve({ inviteId, key, name, inviter })
  }),
  acceptExternalInviteSuccess: createAction('ACCEPT_EXTERNAL_THREAD_INVITE_SUCCESS', (resolve) => {
    return (inviteId: BlockId, id: ThreadId) => resolve({inviteId, id})
  }),
  acceptExternalInviteError: createAction('ACCEPT_EXTERNAL_THREAD_INVITE_ERROR', (resolve) => {
    return (inviteId: BlockId, error: Error) => resolve({ inviteId, error })
  }),
  storeExternalInviteLink: createAction('STORE_EXTERNAL_INVITE_LINK', (resolve) => {
    return (link: string) => resolve({ link })
  }),
  removeExternalInviteLink: createAction('REMOVE_EXTERNAL_INVITE_LINK', (resolve) => {
    return () => resolve()
  }),
  acceptInviteRequest: createAction('ACCEPT_THREAD_INVITE', (resolve) => {
    return (notificationId: NotificationId, threadName: ThreadName) => resolve({ notificationId, threadName  })
  }),
  addInternalInvitesRequest: createAction('ADD_INTERNAL_INVITES_REQUEST', (resolve) => {
    return (threadId: ThreadId, inviteePks: PublicKey[]) => resolve({ threadId, inviteePks  })
  })
}

export type ThreadsAction = ActionType<typeof actions>

export interface InviteQRCode {
  readonly id: ThreadId
  readonly name: ThreadName
  readonly link: string
}

export interface OutboundInvite {
  readonly id: ThreadId
  readonly name: ThreadName
  readonly invite?: ExternalInvite
  readonly error?: Error
}

export interface InboundInvite {
  readonly inviteId: BlockId
  readonly key: PrivateKey
  readonly id?: ThreadId
  readonly name?: ThreadName
  readonly inviter?: UserName
  readonly error?: Error
}

export interface ThreadsState {
  readonly outboundInvites: ReadonlyArray<OutboundInvite>
  readonly inboundInvites: ReadonlyArray<InboundInvite>
  readonly pendingInviteLink?: string // used to hold an invite if triggered before login
  readonly qrCodeInvite?: InviteQRCode
}

export const initialState: ThreadsState = {
  outboundInvites: [],
  inboundInvites: []
}

export function reducer (state: ThreadsState = initialState, action: ThreadsAction): ThreadsState {
  switch (action.type) {
    case getType(actions.threadQRCodeSuccess): {
      return { ...state, qrCodeInvite: action.payload }
    }
    case getType(actions.addExternalInviteRequest): {
      const { id, name } = action.payload
      const existing = state.outboundInvites.find((invite) => invite.id === id )
      if (existing && !existing.error) {
        // if the invite already exists and hasn't error'd, return
        return state
      }
      const outboundInvite = { id, name }
      const outboundInvites = state.outboundInvites.filter((inv) => inv.id !== id).concat([outboundInvite])
      return { ...state, outboundInvites }
    }
    case getType(actions.addExternalInviteSuccess): {
      const { id, invite } = action.payload
      // update the outbound invite with the new Invite object
      const outboundInvites = state.outboundInvites.map((outbound) => {
        return outbound.id === id ? { ...outbound, invite } : outbound
      })
      return { ...state, outboundInvites }
    }
    case getType(actions.addExternalInviteSuccess): {
      const { id, invite } = action.payload
      // update the outbound invite with the new Invite object
      const outboundInvites = state.outboundInvites.map((outbound) => {
        return outbound.id === id ? { ...outbound, invite } : outbound
      })
      return { ...state, outboundInvites }
    }
    case getType(actions.addExternalInviteError): {
      const { id, error } = action.payload
      // update the outbound invite with the new error
      const outboundInvites = state.outboundInvites.map((outbound) => {
        return outbound.id === id ? { ...outbound, error } : outbound
      })
      return { ...state, outboundInvites }
    }
    case getType(actions.acceptExternalInviteRequest): {
      // Store the external invite link in memory
      const { inviteId, key, name, inviter } = action.payload
      const existing = state.inboundInvites.find((obj) => obj.inviteId === inviteId)
      if (existing && !existing.error) {
        // if the invite already exists and hasn't error'd, return
        return state
      }
      const inboundInvite = {inviteId, key, name, inviter}
      const inboundInvites = state.inboundInvites.filter((inv) => inv.inviteId !== inviteId).concat([inboundInvite])
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
  pendingInviteLink: (state: RootState) => state.threads.pendingInviteLink,
  inboundInviteByThreadId: (state: RootState, threadId: ThreadId) => state.threads.inboundInvites.find((invite) => invite.id === threadId),
  inboundInviteByThreadName: (state: RootState, threadName: ThreadName) => state.threads.inboundInvites.find((invite) => invite.name === threadName)
}

export default actions
