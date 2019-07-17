import { combineReducers } from 'redux'
import { ActionType, getType } from 'typesafe-actions'
import { IContact } from '@textile/react-native-sdk'

import { SharedImage } from '../group/add-photo/models'
import * as actions from './actions'
import { CafeSessionsData } from './models'

export interface AccountState {
  readonly initialized: boolean // splitting 'Preferences.onboarded' to within sdk 'initialized' and app specific 'onboarded'
  readonly chosenProfilePhoto: {
    readonly image?: SharedImage
    readonly data?: string
    readonly error?: string
  }
  readonly profile: {
    readonly value?: IContact
    readonly processing: boolean
    readonly error?: string
  }
  readonly peerId: {
    readonly value?: string
    readonly error?: string
  }
  readonly address: {
    readonly value?: string
    readonly error?: string
  }
  readonly avatar: {
    readonly error?: string
  }
  readonly recoveryPhrase: string
  readonly cafeSessions: {
    readonly sessions: CafeSessionsData
    readonly processing: boolean
    readonly error?: string
  }
}

export type AccountAction = ActionType<typeof actions>

export default combineReducers<AccountState, AccountAction>({
  initialized: (state = false, action) => {
    return state
  },
  chosenProfilePhoto: (state = {}, action) => {
    switch (action.type) {
      case getType(actions.chooseProfilePhoto.success):
      case getType(actions.chooseProfilePhoto.failure):
        return { ...state, ...action.payload }
      case getType(actions.setAvatar.success):
      case getType(actions.cancelProfilePhotoUpdate):
        return {}
      default:
        return state
    }
  },
  profile: (state = { processing: true }, action) => {
    switch (action.type) {
      case getType(actions.refreshProfileRequest):
        return { ...state, processing: true }
      case getType(actions.refreshProfileSuccess): {
        const { profile } = action.payload
        return { value: profile, processing: false }
      }
      case getType(actions.profileError): {
        const obj = action.payload.error
        const error =
          (obj.message as string) || (obj as string) || 'unknown error'
        return { ...state, processing: false, error }
      }
      default:
        return state
    }
  },
  peerId: (state = {}, action) => {
    switch (action.type) {
      case getType(actions.refreshPeerIdSuccess): {
        const { peerId } = action.payload
        return { value: peerId }
      }
      case getType(actions.refreshPeerIdError): {
        const obj = action.payload.error
        const error =
          (obj.message as string) || (obj as string) || 'unknown error'
        return { ...state, error }
      }
      default:
        return state
    }
  },
  address: (state = {}, action) => {
    switch (action.type) {
      case getType(actions.refreshAddressSuccess): {
        const { address } = action.payload
        return { value: address }
      }
      case getType(actions.refreshAddressError): {
        const obj = action.payload.error
        const error =
          (obj.message as string) || (obj as string) || 'unknown error'
        return { ...state, error }
      }
      default:
        return state
    }
  },
  avatar: (state = {}, action) => {
    switch (action.type) {
      case getType(actions.setAvatar.failure): {
        const obj = action.payload
        const error =
          (obj.message as string) || (obj as string) || 'unknown error'
        return { ...state, error }
      }
      default:
        return state
    }
  },
  recoveryPhrase: (state = '', action) => {
    switch (action.type) {
      case getType(actions.setRecoveryPhrase):
        return action.payload.recoveryPhrase
      default:
        return state
    }
  },
  cafeSessions: (state = { sessions: {}, processing: false }, action) => {
    switch (action.type) {
      case getType(actions.getCafeSessions.request): {
        return { ...state, processing: true, error: undefined }
      }
      case getType(actions.getCafeSessions.success): {
        const { sessions } = action.payload
        const cafeSessionsData = sessions.reduce(
          (cafeSessionsData, session) => {
            return {
              ...cafeSessionsData,
              [session.cafe.peer]: { session, processing: false }
            }
          },
          {} as CafeSessionsData
        )
        return { sessions: cafeSessionsData, processing: false }
      }
      case getType(actions.getCafeSessions.failure): {
        const { error } = action.payload
        const message =
          (error.message as string) || (error as string) || 'unknown error'
        return { ...state, error: message, processing: false }
      }
      case getType(actions.refreshCafeSession.request): {
        const { peerId } = action.payload
        return {
          ...state,
          sessions: {
            ...state.sessions,
            [peerId]: { ...state.sessions[peerId], processing: true }
          }
        }
      }
      case getType(actions.refreshCafeSession.success): {
        const { session } = action.payload
        const peerId = session.cafe.peer
        return {
          ...state,
          sessions: {
            ...state.sessions,
            [peerId]: { session, processing: false }
          }
        }
      }
      case getType(actions.refreshCafeSession.failure): {
        const { peerId, error } = action.payload
        const message =
          (error.message as string) || (error as string) || 'unknown error'
        return {
          ...state,
          sessions: {
            ...state.sessions,
            [peerId]: {
              ...state.sessions[peerId],
              processing: false,
              error: message
            }
          }
        }
      }
      default:
        return state
    }
  }
})
