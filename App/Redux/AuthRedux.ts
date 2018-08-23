import { createAction, ActionType, getType } from 'typesafe-actions'
import * as TT from '../Models/TextileTypes'
import { RootState } from '../Redux/Types'

const actions = {
  updateReferralCode: createAction('UPDATE_REFERRAL_CODE', resolve => {
    return (referralCode: string) => resolve({ referralCode })
  }),
  updateEmail: createAction('UPDATE_EMAIL', resolve => {
    return (email: string) => resolve({ email })
  }),
  updateUsername: createAction('UPDATE_USERNAME', resolve => {
    return (username: TT.UserName) => resolve({ username })
  }),
  updatePassword: createAction('UPDATE_PASSWORD', resolve => {
    return (password: string) => resolve({ password })
  }),
  signUpRequest: createAction('SIGN_UP_REQUEST', resolve => {
    return (referralCode: string, email: string, username: string, password: string) => resolve({ referralCode, email, username, password })
  }),
  logInRequest: createAction('LOG_IN_REQUEST', resolve => {
    return (username: TT.UserName, password: string) => resolve({ username, password })
  }),
  logOutRequest: createAction('LOG_OUT_REQUEST', resolve => {
    return () => resolve()
  }),
  recoverPasswordRequest: createAction('RECOVER_PASSWORD_REQUEST', resolve => {
    return (data: any) => resolve({ data })
  }),
  signUpSuccess: createAction('SIGN_UP_SUCCESS', resolve => {
    return () => resolve()
  }),
  logInSuccess: createAction('LOG_IN_SUCCESS', resolve => {
    return () => resolve()
  }),
  getTokensSuccess: createAction('GET_TOKENS_SUCCESS', resolve => {
    return (tokens: TT.CafeTokens) => resolve({ tokens })
  }),
  recoverPasswordSuccess: createAction('RECOVER_PASSWORD_SUCCESS', resolve => {
    return () => resolve()
  }),
  signUpFailure: createAction('SIGN_UP_FAILURE', resolve => {
    return (error: Error) => resolve({ error })
  }),
  logInFailure: createAction('LOG_IN_FAILURE', resolve => {
    return (error: Error) => resolve({ error })
  }),
  logOutFailure: createAction('LOG_OUT_FAILURE', resolve => {
    return (error: Error) => resolve({ error })
  }),
  recoverPasswordFailure: createAction('RECOVER_PASSWORD_FAILURE', resolve => {
    return (error: Error) => resolve({ error })
  }),
  dismissError: createAction('DISMISS_ERROR', resolve => {
    return () => resolve()
  }),
  requestCameraPermissions: createAction('REQUEST_CAMERA_PERMISSIONS', resolve => {
    return () => resolve()
  })
}

export type AuthAction = ActionType<typeof actions>

// An email verification regexp when we need it
// const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export type AuthState = {
  readonly processing: boolean
  readonly error?: string
  readonly tokens?: TT.CafeTokens
  readonly formData: {
    readonly referralCode?: string
    readonly email?: string
    readonly username?: string
    readonly password?: string
  }
}

export const initialState: AuthState = {
  processing: false,
  formData: {}
}

export function reducer (state: AuthState = initialState, action: AuthAction): AuthState {
  switch (action.type) {
    case getType(actions.updateReferralCode):
      const { referralCode } = action.payload
      return { ...state, error: undefined, formData: { ...state.formData, referralCode } }
    case getType(actions.updateEmail):
      const { email } = action.payload
      return { ...state, error: undefined, formData: { ...state.formData, email } }
    case getType(actions.updateUsername):
      const { username } = action.payload
      return { ...state, error: undefined, formData: { ...state.formData, username } }
    case getType(actions.updatePassword):
      const { password } = action.payload
      return { ...state, error: undefined, formData: { ...state.formData, password } }
    case getType(actions.signUpRequest):
    case getType(actions.logInRequest):
    case getType(actions.recoverPasswordRequest):
      return { ...state, processing: true }
    case getType(actions.getTokensSuccess):
      return { ...state, processing: false, tokens: action.payload.tokens }
    case getType(actions.recoverPasswordSuccess):
      return { ...state, processing: false }
    case getType(actions.signUpFailure):
    case getType(actions.logInFailure):
    case getType(actions.recoverPasswordFailure):
      return { ...state, processing: false, error: action.payload.error.message }
    case getType(actions.dismissError):
      return { ...state, error: undefined }
    default:
      return state
  }
}

export const AuthSelectors = {
  tokens: (state: RootState) => state.auth.tokens
}

export default actions
