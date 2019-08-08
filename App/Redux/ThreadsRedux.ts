import { createAction, ActionType, getType } from 'typesafe-actions'
import { IExternalInvite } from '@textile/react-native-sdk'

const actions = {
  addExternalInviteRequest: createAction(
    'ADD_EXTERNAL_INVITE_REQUEST',
    resolve => {
      return (id: string, name: string) => resolve({ id, name })
    }
  ),
  addExternalInviteSuccess: createAction(
    'ADD_EXTERNAL_INVITE_SUCCESS',
    resolve => {
      return (id: string, name: string, invite: IExternalInvite) =>
        resolve({ id, name, invite })
    }
  ),
  addExternalInviteError: createAction('ADD_EXTERNAL_INVITE_ERROR', resolve => {
    return (id: string, error: Error) => resolve({ id, error })
  }),
  threadQRCodeRequest: createAction('THREAD_INVITE_QR_REQUEST', resolve => {
    return (id: string, name: string) => resolve({ id, name })
  }),
  threadQRCodeSuccess: createAction('THREAD_INVITE_QR_SUCCESS', resolve => {
    return (id: string, name: string, link: string) =>
      resolve({ id, name, link })
  }),
  acceptExternalInviteRequest: createAction(
    'ACCEPT_EXTERNAL_THREAD_INVITE',
    resolve => {
      return (inviteId: string, key: string, name?: string, inviter?: string) =>
        resolve({ inviteId, key, name, inviter })
    }
  ),
  acceptInviteDismiss: createAction(
    'ACCEPT_EXTERNAL_THREAD_INVITE_DISMISS',
    resolve => {
      return (inviteId: string) => resolve({ inviteId })
    }
  ),
  acceptInviteScanning: createAction(
    'ACCEPT_EXTERNAL_THREAD_INVITE_SCANNING',
    resolve => {
      return (inviteId: string) => resolve({ inviteId })
    }
  ),
  acceptInviteSuccess: createAction(
    'ACCEPT_EXTERNAL_THREAD_INVITE_SUCCESS',
    resolve => {
      return (inviteId: string, id: string) => resolve({ inviteId, id })
    }
  ),
  acceptInviteError: createAction(
    'ACCEPT_EXTERNAL_THREAD_INVITE_ERROR',
    resolve => {
      return (inviteId: string, error: Error) => resolve({ inviteId, error })
    }
  ),
  storeExternalInviteLink: createAction(
    'STORE_EXTERNAL_INVITE_LINK',
    resolve => {
      return (link: string) => resolve({ link })
    }
  ),
  removeExternalInviteLink: createAction(
    'REMOVE_EXTERNAL_INVITE_LINK',
    resolve => {
      return () => resolve()
    }
  ),
  acceptInviteRequest: createAction(
    'ACCEPT_THREAD_NOTIFICATION_INVITE',
    resolve => {
      return (notificationId: string, threadName?: string, goBack?: boolean) =>
        resolve({ notificationId, threadName, goBack })
    }
  ),
  addInternalInvitesRequest: createAction(
    'ADD_INTERNAL_INVITES_REQUEST',
    resolve => {
      return (threadId: string, addresses: string[]) =>
        resolve({ threadId, addresses })
    }
  )
}

export type ThreadsAction = ActionType<typeof actions>

export interface InviteQRCode {
  readonly id: string
  readonly name: string
  readonly link: string
}

export interface OutboundInvite {
  readonly id: string
  readonly name: string
  readonly invite?: IExternalInvite
  readonly error?: Error
}

export type InviteStage = 'joining' | 'scanning' | 'complete' | 'error'

export interface InboundInvite {
  readonly inviteId: string
  readonly inviteKey: string
  readonly stage: InviteStage
  readonly type: 'external' | 'notification'

  readonly dismissed?: boolean // track if UI has dismissed the invite status
  readonly id?: string
  readonly name?: string
  readonly inviter?: string
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

export function reducer(
  state: ThreadsState = initialState,
  action: ThreadsAction
): ThreadsState {
  switch (action.type) {
    case getType(actions.threadQRCodeSuccess): {
      return { ...state, qrCodeInvite: action.payload }
    }
    case getType(actions.addExternalInviteRequest): {
      const { id, name } = action.payload
      const existing = state.outboundInvites.find(invite => invite.id === id)
      if (existing && !existing.error) {
        // if the invite already exists and hasn't error'd, return
        return state
      }
      const outboundInvite = { id, name }
      const outboundInvites = state.outboundInvites
        .filter(inv => inv.id !== id)
        .concat([outboundInvite])
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
    case getType(actions.acceptInviteRequest): {
      const { notificationId, threadName } = action.payload

      const existing = state.inboundInvites.find(
        obj => obj.inviteId === notificationId
      )
      if (existing && !existing.error) {
        // if the invite already exists and hasn't error'd, return ensuring undismiss
        const inboundInvite = { ...existing, dismissed: false }
        const inboundInvites = state.inboundInvites
          .filter(inv => inv.inviteId !== notificationId)
          .concat([inboundInvite])
        return { ...state, inboundInvites }
      }
      const stage: InviteStage = 'joining'
      const inboundInvite: InboundInvite = {
        inviteId: notificationId,
        name: threadName,
        inviteKey: '',
        stage,
        type: 'notification'
      }
      const inboundInvites = state.inboundInvites
        .filter(inv => inv.inviteId !== notificationId)
        .concat([inboundInvite])
      return { ...state, inboundInvites }
    }
    case getType(actions.acceptExternalInviteRequest): {
      // Store the external invite link in memory
      const { inviteId, key, name, inviter } = action.payload
      const existing = state.inboundInvites.find(
        obj => obj.inviteId === inviteId
      )
      if (existing && !existing.error) {
        // if the invite already exists and hasn't error'd, return ensuring undismiss
        const inboundInvite = { ...existing, dismissed: false }
        const inboundInvites = state.inboundInvites
          .filter(inv => inv.inviteId !== inviteId)
          .concat([inboundInvite])
        return { ...state, inboundInvites }
      }
      const stage: InviteStage = 'joining'
      const inboundInvite: InboundInvite = {
        inviteId,
        inviteKey: key,
        name,
        inviter,
        stage,
        type: 'external'
      }
      const inboundInvites = state.inboundInvites
        .filter(inv => inv.inviteId !== inviteId)
        .concat([inboundInvite])
      return { ...state, inboundInvites }
    }
    case getType(actions.acceptInviteScanning): {
      const { inviteId } = action.payload
      // update the inbound invite with the new thread id object
      const inboundInvites = state.inboundInvites.map(inbound => {
        if (inbound.inviteId === inviteId && inbound.stage === 'joining') {
          const stage: InviteStage = 'scanning'
          return { ...inbound, stage }
        }
        return inbound
      })
      return { ...state, inboundInvites }
    }
    case getType(actions.acceptInviteSuccess): {
      const { inviteId, id } = action.payload
      // update the inbound invite with the new thread id object
      const inboundInvites = state.inboundInvites.map(inbound => {
        if (inbound.inviteId === inviteId) {
          const stage: InviteStage = 'complete'
          // dismissed to just hide complete joins from the ui
          return { ...inbound, stage, id, dismissed: true }
        }
        return inbound
      })
      return { ...state, inboundInvites }
    }
    case getType(actions.acceptInviteDismiss): {
      const { inviteId } = action.payload
      // update the inbound invite with the new thread id object
      const inboundInvites = state.inboundInvites.map(inbound => {
        if (inbound.inviteId === inviteId) {
          const dismissed = true
          return { ...inbound, dismissed }
        }
        return inbound
      })
      return { ...state, inboundInvites }
    }
    case getType(actions.acceptInviteError): {
      const { inviteId, error } = action.payload
      // update the inbound invite with the new error
      const inboundInvites = state.inboundInvites.map(inbound => {
        if (inbound.inviteId === inviteId) {
          const stage: InviteStage = 'error'
          return { ...inbound, error, stage }
        }
        return inbound
      })
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

export default actions
