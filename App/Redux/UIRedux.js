import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  authorPhotoShare: ['hash'],
  sharePhotoRequest: ['thread', 'hash', 'caption'],
  selectImage: ['index'],
  imageSharingError: ['error'],
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

export const selectImage = (state, {index}) =>
  state.merge({...state, currentIndex: index})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.AUTHOR_PHOTO_SHARE]: authorPhotoShare,
  [Types.CANCEL_AUTHORING_PHOTO_SHARE]: cancelAuthoringPhotoShare,
  [Types.SELECT_IMAGE]: selectImage
})
