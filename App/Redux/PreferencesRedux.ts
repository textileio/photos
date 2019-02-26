import { createAction, ActionType, getType } from 'typesafe-actions'
import { RootState } from './Types'

const actions = {
  onboardingSuccess: createAction('ONBOARDING_SUCCESS', (resolve) => {
    return () => resolve()
  }),
  toggleVerboseUi: createAction('TOGGLE_VERBOSE_UI', (resolve) => {
    return () => resolve()
  }),
  completeTourSuccess: createAction('COMPLETE_TOUR_SUCCESS', (resolve) => {
    return (tourKey: TourScreens) => resolve({ tourKey })
  }),
  toggleServicesRequest: createAction('TOGGLE_SERVICES_REQUEST', (resolve) => {
    return (name: ServiceType, status?: boolean) => resolve({ name, status })
  }),
  toggleStorageRequest: createAction('TOGGLE_STORAGE_REQUEST', (resolve) => {
    return (name: StorageType, status?: boolean) => resolve({ name, status })
  }),
  updateViewSetting: createAction('TOGGLE_VIEW_SETTING', (resolve) => {
    return (name: string, value: string) => resolve({ name, value })
  })
}

export type PreferencesAction = ActionType<typeof actions>

export type TourScreens = 'wallet' | 'threads' | 'threadView' | 'threadsManager' | 'notifications' | 'feed' | 'location'
export type ServiceType = 'backgroundLocation' | 'notifications' |
  'INVITE_RECEIVED' |
  'ACCOUNT_PEER_JOINED' |
  'PEER_JOINED' |
  'PEER_LEFT' |
  'FILES_ADDED' |
  'COMMENT_ADDED' |
  'LIKE_ADDED'
export type StorageType = 'autoPinPhotos' |
  'storeHighRes' |
  'deleteDeviceCopy' |
  'enablePhotoBackup' |
  'enableWalletBackup'
export interface Service {
  status: boolean,
}
export interface ViewSettings {
  selectedWalletTab: 'Photos' | 'Groups' | 'Contacts',
}
export interface PreferencesState {
  verboseUi: boolean
  readonly services: {readonly [k in ServiceType]: Service}
  readonly storage: {readonly [k in StorageType]: Service}
  readonly tourScreens: {readonly [k in TourScreens]: boolean} // true = still need to show, false = no need
  viewSettings: ViewSettings
  onboarded: boolean
}

export const initialState: PreferencesState = {
  onboarded: false,
  verboseUi: false,
  tourScreens: {
    wallet: true,
    threads: true,
    threadView: true,
    threadsManager: true,
    notifications: true,
    feed: true,
    location: true
  },
  services: {
    notifications: {
      status: false
    },
    FILES_ADDED: {
      status: true
    },
    INVITE_RECEIVED: {
      status: true
    },
    ACCOUNT_PEER_JOINED: {
      status: false
    },
    COMMENT_ADDED: {
      status: true
    },
    LIKE_ADDED: {
      status: true
    },
    PEER_JOINED: {
      status: false
    },
    PEER_LEFT: {
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
  },
  viewSettings: {
    selectedWalletTab: 'Groups'
  }
}

export function reducer (state: PreferencesState = initialState, action: PreferencesAction): PreferencesState {
  switch (action.type) {
    case getType(actions.onboardingSuccess):
      return { ...state, onboarded: true }
    case getType(actions.toggleVerboseUi):
      return { ...state, verboseUi: !state.verboseUi }
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
    case getType(actions.updateViewSetting): {
      return {...state, viewSettings: {...state.viewSettings, [action.payload.name]: action.payload.value}}
    }
    default:
      return state
  }
}

export const PreferencesSelectors = {
  onboarded: (state: RootState) => state.preferences.onboarded,
  service: (state: RootState, name: ServiceType) => state.preferences.services[name],
  storage: (state: RootState, name: StorageType) => state.preferences.storage[name],
  verboseUi: (state: RootState) => state.preferences.verboseUi,
  autoPinStatus: (state: RootState) => state.preferences.storage.autoPinPhotos.status
}

export default actions
