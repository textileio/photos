import { createReducer, createActions } from 'reduxsauce'
import Immutable from 'seamless-immutable'

/* ------------- Types and Action Creators ------------- */

const { Types, Creators } = createActions({
  viewPhotoRequest: ['index', 'thread'],
  dismissViewedPhoto: null,
  authorPhotoShareRequest: ['hash'],
  cancelAuthoringPhotoShare: null,
  updateComment: ['comment'],
  sharePhotoRequest: ['thread', 'hash', 'caption'],
  selectImage: ['index'],
  imageSharingError: ['error']
})

export const UITypes = Types
export default Creators

/* ------------- Initial State ------------- */

export const INITIAL_STATE = Immutable({
  viewingPhoto: {
    active: false,
    index: null,
    thread: null
  },
  sharingPhoto: {
    active: false,
    hash: null,
    threads: [],
    comment: null
  }
})

/* ------------- Selectors ------------- */

export const UISelectors = {
}

/* ------------- Reducers ------------- */

export const viewPhoto = (state, {index, thread}) =>
  state.merge({...state, viewingPhoto: {active: true, index, thread}})

export const clearViewedPhoto = (state) =>
  state.merge({...state, viewingPhoto: {...state.viewingPhoto, active: false}})

export const authorPhotoShare = (state, {hash}) =>
  state.merge({...state, sharingPhoto: {...state.sharingPhoto, active: true, hash}})

export const cancelAuthoringPhotoShare = (state) =>
  state.merge({...state, sharingPhoto: {...state.sharingPhoto, active: false}})

export const updateComment = (state, {comment}) =>
  state.merge({...state, sharingPhoto: {...state.sharingPhoto, comment}})

export const selectImage = (state, {index}) =>
  state.merge({...state, viewingPhoto: {...state.viewingPhoto, index}})

/* ------------- Hookup Reducers To Types ------------- */

export const reducer = createReducer(INITIAL_STATE, {
  [Types.VIEW_PHOTO_REQUEST]: viewPhoto,
  [Types.DISMISS_VIEWED_PHOTO]: clearViewedPhoto,
  [Types.AUTHOR_PHOTO_SHARE_REQUEST]: authorPhotoShare,
  [Types.CANCEL_AUTHORING_PHOTO_SHARE]: cancelAuthoringPhotoShare,
  [Types.UPDATE_COMMENT]: updateComment,
  [Types.SELECT_IMAGE]: selectImage
})
