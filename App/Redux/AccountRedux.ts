import { createAction, ActionType, getType } from 'typesafe-actions'
import { Profile } from '../NativeModules/Textile'

const actions = {
  refreshProfileRequest: createAction('REFRESH_PROFILE_REQUEST'),
  refreshProfileSuccess: createAction('REFRESH_PROFILE_SUCCESS', (resolve) => {
    return (profile: Profile) => resolve({ profile })
  }),
  profileError: createAction('PROFILE_ERROR', (resolve) => {
    return (error: any) => resolve({ error })
  }),
  refreshPeerIdRequest: createAction('REFRESH_PEER_ID_REQUEST'),
  refreshPeerIdSuccess: createAction('REFRESH_PEER_ID_SUCCESS', (resolve) => {
    return (peerId: string) => resolve({ peerId })
  }),
  refreshPeerIdError: createAction('REFRESH_PEER_ID_ERROR', (resolve) => {
    return (error: any) => resolve({ error })
  }),
  setUsernameRequest: createAction('SET_USERNAME_REQUEST', (resolve) => {
    return (username: string) => resolve({ username })
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
  profile: {
    value?: Profile
    processing: boolean
    error?: string
  }
  peerId: {
    value?: string
    error?: string
  }
  avatar: {
    pendingId?: string
    error?: string
  }
  recoveryPhrase?: string
}

const initialState: AccountState = {
  profile: {
    processing: false
  },
  peerId: {},
  avatar: {}
}

export function reducer(state: AccountState = initialState, action: AccountAction): AccountState {
  switch (action.type) {
    case getType(actions.setUsernameRequest):
    case getType(actions.refreshProfileRequest):
      return { ...state, profile: { ...state.profile, processing: true } }
    case getType(actions.refreshProfileSuccess):
      const { profile } = action.payload
      return { ...state, profile: { value: profile, processing: false } }
    case getType(actions.profileError): {
      const obj = action.payload.error
      const error = obj.message as string || obj as string || 'unknown error'
      return { ...state, profile: { ...state.profile, processing: false, error } }
    }
    case getType(actions.refreshPeerIdSuccess):
      const { peerId } = action.payload
      return { ...state, peerId: { value: peerId } }
    case getType(actions.refreshPeerIdError): {
      const obj = action.payload.error
      const error = obj.message as string || obj as string || 'unknown error'
      return { ...state, peerId: { ...state.peerId, error } }
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
