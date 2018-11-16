import { createAction, ActionType, getType } from 'typesafe-actions'
import { RootState } from './Types'

const actions = {
  dismissError: createAction('DISMISS_ERROR', (resolve) => {
    return () => resolve()
  }),
  requestCameraPermissions: createAction('REQUEST_CAMERA_PERMISSIONS', (resolve) => {
    return () => resolve()
  }),
  onboardWithInviteRequest: createAction('ONBOARD_WITH_INVITE_REQUEST', (resolve) => {
    return (url: string, hash: string, referral: string ) => resolve( { url, hash, referral } )
  })
}

export type AuthAction = ActionType<typeof actions>

// An email verification regexp when we need it
// const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export interface AuthState {
  readonly processing: boolean
  readonly error?: string
  readonly invite?: {
    readonly url: string
    readonly hash: string
    readonly referral: string
  }
}

export const initialState: AuthState = {
  processing: false
}

export function reducer (state: AuthState = initialState, action: AuthAction): AuthState {
  switch (action.type) {
    case getType(actions.dismissError):
      return { ...state, error: undefined }
    case getType(actions.onboardWithInviteRequest):
      return { ...state, invite: action.payload }
    default:
      return state
  }
}

export const AuthSelectors = {
  invite: (state: RootState) => state.auth.invite
}

export default actions
