import { createAction, ActionType, getType } from 'typesafe-actions'
import { Profile } from '../NativeModules/Textile'

const actions = {
  refreshAccountInfoRequest: createAction('REFRESH_ACCOUNT_INFO_REQUEST'),
  refreshAccountInfoSuccess: createAction('REFRESH_ACCOUNT_INFO_SUCCESS', (resolve) => {
    return (address: string, peerId: string, profile: Profile, seed: string, username?: string) => resolve({ address, peerId, profile, seed, username })
  }),
  refreshAccountInfoError: createAction('REFRESH_ACCOUNT_INFO_ERROR', (resolve) => {
    return (error: any) => resolve({ error })
  }),
  setAvatarRequest: createAction('SET_AVATAR_REQUEST', (resolve) => {
    return (avatarId: string) => resolve({ avatarId })
  }),
  setAvatarError: createAction('SET_AVATAR_ERROR', (resolve) => {
    return (error: any) => resolve({ error })
  }),
  setPendingAvatar: createAction('SET_PENDING_AVATAR', (resolve) => {
    return (avatarId: string) => resolve({ avatarId })
  }),
  setRecoveryPhrase: createAction('SET_RECOVERY_PHRASE', (resolve) => {
    return (recoveryPhrase: string) => resolve({ recoveryPhrase })
  })
}

export type AccountAction = ActionType<typeof actions>

interface AccountState {
  info: {
    address?: string
    peerId?: string
    profile?: Profile
    seed?: string
    username?: string
    error?: string
  }
  avatar: {
    pendingId?: string
    error?: string
  }
  recoveryPhrase?: string
}

const initialState: AccountState = {
  info: {},
  avatar: {}
}

export function reducer(state: AccountState = initialState, action: AccountAction): AccountState {
  switch (action.type) {
    case getType(actions.refreshAccountInfoSuccess):
      const { address, peerId, profile, seed, username } = action.payload
      return { ...state, info: { address, peerId, profile, seed, username } }
    case getType(actions.refreshAccountInfoError): {
      const obj = action.payload.error
      const error = obj.message as string || obj as string || 'unknown error'
      return { ...state, info: { ...state.info, error } }
    }
    case getType(actions.setAvatarError): {
      const obj = action.payload.error
      const error = obj.message as string || obj as string || 'unknown error'
      return { ...state, avatar: { ...state.avatar, error } }
    }
    case getType(actions.setPendingAvatar):
      return { ...state, avatar: { ...state.avatar, pendingId: action.payload.avatarId } }
    case getType(actions.setRecoveryPhrase):
      return { ...state, recoveryPhrase: action.payload.recoveryPhrase }
    default:
      return state
  }
}

export default actions
