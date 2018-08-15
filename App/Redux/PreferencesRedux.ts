import { createAction, ActionType, getType } from 'typesafe-actions'
import { Profile } from '../Models/TextileTypes'

const actions = {
  onboardedSuccess: createAction('ONBOARDED_SUCCESS', resolve => {
    return () => resolve()
  }),
  toggleVerboseUi: createAction('TOGGLE_VERBOSE_UI', resolve => {
    return () => resolve()
  }),
  updatecMnemonic: createAction('UPDATE_MNEMONIC', resolve => {
    return (mnemonic: string) => resolve({ mnemonic })
  }),
  getProfileSuccess: createAction('GET_AVATAR_SUCCESS', resolve => {
    return (profile: Profile) => resolve({ profile })
  }),
  setAvatar: createAction('SET_AVATAR_REQUEST', resolve => {
    return (avatarId: string) => resolve({avatarId})
  }),
  pendingAvatar: createAction('PENDING_AVATAR_REQUEST', resolve => {
    return (avatarId: string) => resolve({avatarId})
  }),
  getPublicKeySuccess: createAction('GET_PUBLIC_KEY_SUCCESS', resolve => {
    return (publicKey: string) => resolve({ publicKey })
  }),
  completeTourSuccess: createAction('COMPLETE_TOUR_SUCCESS', resolve => {
    return (tourKey: TourScreens) => resolve({ tourKey })
  }),
  updateServiceRequest: createAction('UPDATE_SERVICE_REQUEST', resolve => {
    return (name: Services, update: Service) => resolve({ name, update })
  }),
}

export type PreferencesAction = ActionType<typeof actions>

export type TourScreens = 'wallet' | 'threads'
export type Services = 'backgroundLocation' | 'notifications' | 'newSharedPhoto'
export type Service = {
  status: boolean,
  dependsOn?: Services
}
export type PreferencesState = {
  onboarded: boolean
  verboseUi: boolean
  mnemonic?: string
  publicKey?: string
  profile?: Profile
  pending?: string,
  readonly services: {[index: string]: Service}
  readonly tourScreens: {[index: string]: boolean} // true = still need to show, false = no need
}

export const initialState: PreferencesState = {
  onboarded: false,
  verboseUi: false,
  tourScreens: {
    wallet: true,
    threads: true
  },
  services: {
    backgroundLocation: {
      status: false
    },
    notifications: {
      status: false,
    },
    receivedInviteNotification: {
      status: false,
      dependsOn: 'notifications'
    },
    deviceAddedNotification: {
      status: false,
      dependsOn: 'notifications'
    },
    photoAddedNotification: {
      status: false,
      dependsOn: 'notifications'
    },
    commentAddedNotification: {
      status: false,
      dependsOn: 'notifications'
    },
    likeAddedNotification: {
      status: false,
      dependsOn: 'notifications'
    },
    peerJoinedNotification: {
      status: false,
      dependsOn: 'notifications'
    },
    peerLeftNotification: {
      status: false,
      dependsOn: 'notifications'
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
      return { ...state, mnemonic: action.payload.mnemonic }
    case getType(actions.getProfileSuccess):
      return { ...state, profile: action.payload.profile, pending: undefined}
    case getType(actions.pendingAvatar):
      return { ...state, pending: action.payload.avatarId }
    case getType(actions.getPublicKeySuccess):
      return { ...state, publicKey: action.payload.publicKey }
    case getType(actions.completeTourSuccess):
      const tours = state.tourScreens
      if(!tours.hasOwnProperty(action.payload.tourKey)) return state
      tours[action.payload.tourKey] = false
      return { ...state, tourScreens: tours }
    case getType(actions.updateServiceRequest):
      console.log('axh', action.payload)
      return { ...state, services: {...state.services, [action.payload.name]: action.payload.update} }
    default:
      return state
  }
}

export const PreferencesSelectors = {
  // TODO: Need typed state
  onboarded: (state: any) => state.preferences.onboarded,
  pending: (state: any) => state.preferences.pending,
  profile: (state: any) => state.preferences.profile
}

export default actions
