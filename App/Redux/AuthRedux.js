import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'
import t from 'tcomb-form-native'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  updateFormType: ['formType'],
  updateFormValue: ['formValue'],
  signUpRequest: ['data'],
  logInRequest: ['data'],
  recoverPasswordRequest: ['data'],
  signUpSuccess: ['token'],
  logInSuccess: ['token'],
  recoverPasswordSuccess: null,
  signUpFailure: ['error'],
  logInFailure: ['error'],
  recoverPasswordFailure: ['error']
})

export const AuthTypes = Types
export default Creators

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

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  processing: false,
  error: null,
  token: null,
  formType: SignUp,
  formValue: null
})

/* ------------- Selectors ------------- */

export const AuthSelectors = {
}

/* ------------- Reducers ------------- */

export const updateFormType = (state, {formType}) =>
  state.merge({...state, formType})

export const updateFormValue = (state, {formValue}) =>
  state.merge({...state, formValue})

export const handleRequest = state =>
  state.merge({...state, processing: true})

export const handleSuccess = (state, {token}) =>
  state.merge({...state, processing: false, token})

export const handleRecoverPasswordSuccess = state =>
  state.merge({...state, processing: false})

export const handleFailure = (state, {error}) => {
  const { message } = error
  return state.merge({...state, processing: false, error: message})
}
/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.UPDATE_FORM_TYPE]: updateFormType,
  [Types.UPDATE_FORM_VALUE]: updateFormValue,
  [Types.SIGN_UP_REQUEST]: handleRequest,
  [Types.LOG_IN_REQUEST]: handleRequest,
  [Types.RECOVER_PASSWORD_REQUEST]: handleRequest,
  [Types.SIGN_UP_SUCCESS]: handleSuccess,
  [Types.LOG_IN_SUCCESS]: handleSuccess,
  [Types.RECOVER_PASSWORD_SUCCESS]: handleRecoverPasswordSuccess,
  [Types.SIGN_UP_FAILURE]: handleFailure,
  [Types.LOG_IN_FAILURE]: handleFailure,
  [Types.RECOVER_PASSWORD_FAILURE]: handleFailure
})
