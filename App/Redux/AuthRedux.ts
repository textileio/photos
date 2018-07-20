import { createAction, ActionType, getType } from 'typesafe-actions'
import t from 'tcomb-form-native'

const actions = {
  updateFormType: createAction('UPDATE_FORM_TYPE', resolve => {
    return (formType: any) => resolve({ formType })
  }),
  updateFormValue: createAction('UPDATE_FORM_VALUE', resolve => {
    return (formValue: any) => resolve({ formValue })
  }),
  signUpRequest: createAction('SIGN_UP_REQUEST', resolve => {
    return (data: any) => resolve({ data })
  }),
  logInRequest: createAction('LOG_IN_REQUEST', resolve => {
    return (data: any) => resolve({ data })
  }),
  recoverPasswordRequest: createAction('RECOVER_PASSWORD_REQUEST', resolve => {
    return (data: any) => resolve({ data })
  }),
  signUpSuccess: createAction('SIGN_UP_SUCCESS', resolve => {
    return (token: string) => resolve({ token })
  }),
  logInSuccess: createAction('LOG_IN_SUCCESS', resolve => {
    return (token: string) => resolve({ token })
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
  recoverPasswordFailure: createAction('RECOVER_PASSWORD_FAILURE', resolve => {
    return (error: Error) => resolve({ error })
  }),
  dismissError: createAction('DISMISS_ERROR', resolve => {
    return () => resolve()
  })
}

export type AuthAction = ActionType<typeof actions>

const Email = t.refinement(t.String, function (n) {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(String(n).toLowerCase())
})

export const SignUp = t.struct({
  referralCode: t.String,
  username: t.String,
  email: Email,
  password: t.String
})

export const LogIn = t.struct({
  username: t.String,
  password: t.String
})

export const RecoverPassword = t.struct({
  username: t.String
})

export type AuthState = {
  readonly processing: boolean
  readonly error?: string
  readonly token?: string
  readonly formType: any
  readonly formValue?: any
}

export const initialState: AuthState = {
  processing: false,
  formType: SignUp
}

export function reducer (state: AuthState = initialState, action: AuthAction): AuthState {
  switch (action.type) {
    case getType(actions.updateFormType):
      return { ...state, formType: action.payload.formType }
    case getType(actions.updateFormValue):
      const values = action.payload.formValue
      const error = values.password && values.password.length > 28 ? 'React Native bug limits passwords to less than 28 characters' : undefined
      const password = error ? '' : values.password
      const formValue = {...values, password}
      return { ...state, formValue, error }
    case getType(actions.signUpRequest):
    case getType(actions.logInRequest):
    case getType(actions.recoverPasswordRequest):
      return { ...state, processing: true }
    case getType(actions.signUpSuccess):
    case getType(actions.logInSuccess):
      return { ...state, processing: false, token: action.payload.token }
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

export default actions
