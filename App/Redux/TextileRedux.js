import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  randomUsersRequest: ['seed', 'page', 'results'],
  randomUsersRequestSuccess: ['data'],
  randomUsersRequestFailure: null,
  onboardedSuccess: null,
})

export const TextileTypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  randomUserData: null,
  fetching: null,
  error: null,
  onboarded: false
})

/* ------------- Selectors ------------- */

export const TextileSelectors = {
  getRandomUserData: state => state.textile.randomUserData
}

/* ------------- Reducers ------------- */

export const onboardedSuccess = state => {
  return state.merge({ onboarded: true })
}

// request the data from an api
export const randomUsersRequest = state => {
  return state.merge({ fetching: true })
}

// successful api lookup
export const randomUsersRequestSuccess = (state, action) => {
  const { randomUserData } = action
  return state.merge({ fetching: false, randomUserData })
}

// Something went wrong somewhere.
export const randomUsersRequestFailure = state =>
  state.merge({ fetching: false, error: true, randomUserData: null })

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.RANDOM_USERS_REQUEST]: randomUsersRequest,
  [Types.RANDOM_USERS_REQUEST_SUCCESS]: randomUsersRequestSuccess,
  [Types.RANDOM_USERS_REQUEST_FAILURE]: randomUsersRequestFailure,
  [Types.ONBOARDED_SUCCESS]: onboardedSuccess,
})
