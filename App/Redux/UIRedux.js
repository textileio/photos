import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  authorPhotoShare: ['hash'],
  cancelAuthoringPhotoShare: null
})

export const UITypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  authoringPhotoShare: null
})

/* ------------- Selectors ------------- */

export const UISelectors = {
}

/* ------------- Reducers ------------- */

export const authorPhotoShare = (state, {hash}) =>
  state.merge({...state, authoringPhotoShare: hash})

export const cancelAuthoringPhotoShare = (state) =>
  state.merge({...state, authoringPhotoShare: null})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.AUTHOR_PHOTO_SHARE]: authorPhotoShare,
  [Types.CANCEL_AUTHORING_PHOTO_SHARE]: cancelAuthoringPhotoShare
})
