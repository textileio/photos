import { createAction, createAsyncAction } from 'typesafe-actions'
import { ICafeSession, IContact } from '@textile/react-native-sdk'

import { SharedImage } from '../group/add-photo/models'

export const chooseProfilePhoto = createAsyncAction(
  'account/CHOOSE_PROFILE_PHOTO_REQUEST',
  'account/CHOOSE_PROFILE_PHOTO_SUCCESS',
  'account/CHOOSE_PROFILE_PHOTO_ERROR'
)<void, { image: SharedImage; data: string }, any>()

export const cancelProfilePhotoUpdate = createAction(
  'account/CANCEL_PROFILE_PHOTO_UPDATE',
  resolve => {
    return () => resolve()
  }
)

export const refreshProfileRequest = createAction(
  'account/REFRESH_PROFILE_REQUEST'
)

export const refreshProfileSuccess = createAction(
  'account/REFRESH_PROFILE_SUCCESS',
  resolve => {
    return (profile: IContact) => resolve({ profile })
  }
)

export const profileError = createAction('account/PROFILE_ERROR', resolve => {
  return (error: any) => resolve({ error })
})

export const refreshPeerIdRequest = createAction(
  'account/REFRESH_PEER_ID_REQUEST'
)

export const refreshPeerIdSuccess = createAction(
  'account/REFRESH_PEER_ID_SUCCESS',
  resolve => {
    return (peerId: string) => resolve({ peerId })
  }
)

export const refreshPeerIdError = createAction(
  'account/REFRESH_PEER_ID_ERROR',
  resolve => {
    return (error: any) => resolve({ error })
  }
)

export const refreshAddressRequest = createAction(
  'account/REFRESH_ADDRESS_REQUEST'
)

export const refreshAddressSuccess = createAction(
  'account/REFRESH_ADDRESS_SUCCESS',
  resolve => {
    return (address: string) => resolve({ address })
  }
)

export const refreshAddressError = createAction(
  'account/REFRESH_ADDRESS_ERROR',
  resolve => {
    return (error: any) => resolve({ error })
  }
)

export const setUsernameRequest = createAction(
  'account/SET_USERNAME_REQUEST',
  resolve => {
    return (username: string) => resolve({ username })
  }
)

export const setAvatar = createAsyncAction(
  'account/SET_AVATAR_REQUEST',
  'account/SET_AVATAR_SUCCESS',
  'account/SET_AVATAR_FAILURE'
)<SharedImage, void, any>()

export const setRecoveryPhrase = createAction(
  'account/SET_RECOVERY_PHRASE',
  resolve => {
    return (recoveryPhrase: string) => resolve({ recoveryPhrase })
  }
)

export const getCafeSessionsRequest = createAction(
  'account/GET_CAFE_SESSIONS_REQUEST'
)

export const refreshCafeSessionsRequest = createAction(
  'account/REFRESH_CAFE_SESSIONS_REQUEST'
)

export const cafeSessionsSuccess = createAction(
  'account/CAFE_SESSIONS_SUCCESS',
  resolve => {
    return (sessions: ReadonlyArray<ICafeSession>) => resolve({ sessions })
  }
)

export const cafeSessionsError = createAction(
  'account/CAFE_SESSIONS_ERROR',
  resolve => {
    return (error: any) => resolve({ error })
  }
)

export const refreshMessagesRequest = createAction('account/REFRESH_MESSAGES')
