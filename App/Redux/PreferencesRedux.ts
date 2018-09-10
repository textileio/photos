import { createAction, ActionType, getType } from 'typesafe-actions'
import { RootState } from '../Redux/Types'
import { Mnemonic, PhotoId, Profile, PublicKey } from '../Models/TextileTypes'

const actions = {
  onboardedSuccess: createAction('ONBOARDED_SUCCESS', (resolve) => {
    return () => resolve()
  }),
  toggleVerboseUi: createAction('TOGGLE_VERBOSE_UI', (resolve) => {
    return () => resolve()
  }),
  updatecMnemonic: createAction('UPDATE_MNEMONIC', (resolve) => {
    return (mnemonic: Mnemonic) => resolve({ mnemonic })
  }),
  getProfileSuccess: createAction('GET_AVATAR_SUCCESS', (resolve) => {
    return (profile: Profile) => resolve({ profile })
  }),
  setAvatar: createAction('SET_AVATAR_REQUEST', (resolve) => {
    return (avatarId: PhotoId) => resolve({ avatarId })
  }),
  pendingAvatar: createAction('PENDING_AVATAR_REQUEST', (resolve) => {
    return (avatarId: PhotoId) => resolve({ avatarId })
  }),
  getPublicKeySuccess: createAction('GET_PUBLIC_KEY_SUCCESS', (resolve) => {
    return (publicKey: PublicKey) => resolve({ publicKey })
  }),
  completeTourSuccess: createAction('COMPLETE_TOUR_SUCCESS', (resolve) => {
    return (tourKey: TourScreens) => resolve({ tourKey })
  }),
  toggleServicesRequest: createAction('TOGGLE_SERVICES_REQUEST', (resolve) => {
    return (name: ServiceType, status?: boolean) => resolve({ name, status })
  }),
  toggleStorageRequest: createAction('TOGGLE_STORAGE_REQUEST', (resolve) => {
    return (name: StorageType, status?: boolean) => resolve({ name, status })
  })
}

export type PreferencesAction = ActionType<typeof actions>

export type TourScreens = 'wallet' | 'threads' | 'notifications' | 'feed'
export type ServiceType = 'backgroundLocation' |
  'notifications' |
  'photoAddedNotification' |
  'receivedInviteNotification' |
  'deviceAddedNotification' |
  'commentAddedNotification' |
  'likeAddedNotification' |
  'peerJoinedNotification' |
  'peerLeftNotification'
export type StorageType = 'autoPinPhotos' |
  'storeHighRes' |
  'deleteDeviceCopy' |
  'enablePhotoBackup' |
  'enableWalletBackup'
export interface Service {
  status: boolean,
}
export interface PreferencesState {
  onboarded: boolean
  verboseUi: boolean
  mnemonic?: Mnemonic
  publicKey?: PublicKey
  profile?: Profile
  pending?: PhotoId
  readonly services: {readonly [k in ServiceType]: Service}
  readonly storage: {readonly [k in StorageType]: Service}
  readonly tourScreens: {readonly [k in TourScreens]: boolean} // true = still need to show, false = no need
}

export const initialState: PreferencesState = {
  onboarded: false,
  verboseUi: false,
  tourScreens: {
    wallet: true,
    threads: true,
    notifications: true,
    feed: true
  },
  services: {
    notifications: {
      status: false
    },
    photoAddedNotification: {
      status: true
    },
    receivedInviteNotification: {
      status: true
    },
    deviceAddedNotification: {
      status: false
    },
    commentAddedNotification: {
      status: true
    },
    likeAddedNotification: {
      status: true
    },
    peerJoinedNotification: {
      status: false
    },
    peerLeftNotification: {
      status: false
    },
    backgroundLocation: {
      status: false
    }
  },
  storage: {
    autoPinPhotos: {
      status: false
    },
    storeHighRes: {
      status: false
    },
    deleteDeviceCopy: {
      status: false
    },
    enablePhotoBackup: {
      status: false
    },
    enableWalletBackup: {
      status: false
    }
  }
}

export function reducer (state: PreferencesState = initialState, action: PreferencesAction): PreferencesState {
  switch (action.type) {
    case getType(actions.onboardedSuccess):
      return { ...state, onboarded: true }
    case getType(actions.toggleVerboseUi):
      return { ...state, verboseUi: !state.verboseUi }
    case getType(actions.updatecMnemonic):
      const mnemonic = action.payload.mnemonic
      return { ...state, mnemonic }
    case getType(actions.getProfileSuccess):
      return { ...state, profile: action.payload.profile, pending: undefined}
    case getType(actions.pendingAvatar):
      const pending = action.payload.avatarId
      return { ...state, pending }
    case getType(actions.getPublicKeySuccess):
      return { ...state, publicKey: action.payload.publicKey }
    case getType(actions.completeTourSuccess):
      return { ...state, tourScreens: { ...state.tourScreens, [action.payload.tourKey]: false } }
    case getType(actions.toggleServicesRequest): {
      const service = state.services[action.payload.name]
      service.status = action.payload.status === undefined ? !service.status : action.payload.status
      return {...state, services: {...state.services, [action.payload.name]: service}}
    }
    case getType(actions.toggleStorageRequest): {
      const storageType = state.storage[action.payload.name]
      storageType.status = action.payload.status === undefined ? !storageType.status : action.payload.status
      return {...state, storage: {...state.storage, [action.payload.name]: storageType}}
    }
    default:
      return state
  }
}

export const PreferencesSelectors = {
  // TODO: Need typed state
  onboarded: (state: RootState) => state.preferences.onboarded,
  pending: (state: RootState) => state.preferences.pending,
  profile: (state: RootState) => state.preferences.profile,
  service: (state: RootState, name: ServiceType) => state.preferences.services[name],
  storage: (state: RootState, name: StorageType) => state.preferences.storage[name],
  verboseUi: (state: RootState) => state.preferences.verboseUi,
  autoPinStatus: (state: RootState) => state.preferences.storage.autoPinPhotos.status
}

export default actions
