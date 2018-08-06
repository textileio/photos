import { createAction, ActionType, getType } from 'typesafe-actions'
import * as TextileTypes from '../Models/TextileTypes'

const actions = {
  chooseProfilePhotoRequest: createAction('CHOOSE_PROFILE_PHOTO_REQUEST'),
  chooseProfilePhotoSuccess: createAction('CHOOSE_PROFILE_PHOTO_SUCCESS', resolve => {
    return (uri: string, data: string) => resolve({ uri, data })
  }),
  chooseProfilePhotoError: createAction('CHOOSE_PROFILE_PHOTO_ERROR', resolve => {
    return (error: Error) => resolve({ error })
  }),
  selectProfilePicture: createAction('SELECT_PROFILE_PICTURE', resolve => {
    return (uri: string) => resolve({ uri })
  }),
  viewPhotoRequest: createAction('VIEW_PHOTO_REQUEST', resolve => {
    return (photoId: string, threadId: string) => resolve({ photoId, threadId })
  }),
  switchViewdPhoto: createAction('SWITCH_VIEWED_PHOTO', resolve => {
    return (photoId: string) => resolve(photoId)
  }),
  dismissViewedPhoto: createAction('DISMISS_VIEWED_PHOTO', resolve => {
    return () => resolve()
  }),
  authorPhotoShareRequest: createAction('AUTHOR_PHOTO_SHARE_REQUEST', resolve => {
    return (hash: string) => resolve(hash)
  }),
  cancelAuthoringPhotoShare: createAction('CANCEL_AUTHORING_PHOTO_SHARE', resolve => {
    return () => resolve()
  }),
  updateSelectedThreads: createAction('UPDATE_SELECTED_THREADS', resolve => {
    return (threadIds: ReadonlyMap<string, boolean>) => resolve({ threadIds })
  }),
  updateComment: createAction('UPDATE_COMMENT', resolve => {
    return (comment: string) => resolve(comment)
  }),
  sharePhotoRequest: createAction('SHARE_PHOTO_REQUEST', resolve => {
    return (id: string, threadIds: [string], caption?: string) => resolve({ id, threadIds, caption })
  }),
  getPublicLink: createAction('GET_PUBLIC_LINK', resolve => {
    return (photoId: string) => resolve({ photoId })
  }),
  imageSharingError: createAction('IMAGE_SHARING_ERROR', resolve => {
    return (error: Error) => resolve(error)
  }),
  showImagePicker: createAction('SHOW_IMAGE_PICKER', resolve => {
    return (threadId: string) => resolve({ threadId })
  }),
  newImagePickerSelection: createAction('NEW_IMAGE_PICKER_SELECTION', resolve => {
    return (threadId: string) => resolve({ threadId })
  }),
  imagePickerSuccess: createAction('IMAGE_PICKER_SUCCESS', resolve => {
    return (threadId: string, image: TextileTypes.SharedImage) => resolve({ threadId, image })
  }),
}

export type UIAction = ActionType<typeof actions>

export type UIState = {
  readonly chosenProfilePhoto: {
    readonly uri?: string,
    readonly data?: string
    readonly error?: Error
  }
  readonly viewingPhoto: {
    readonly active: boolean
    readonly photoId?: string
    readonly threadId?: string
  },
  readonly sharingPhoto: {
    readonly active: boolean,
    readonly hash?: string,
    readonly selectedThreads: ReadonlyMap<string, boolean>,
    readonly comment?: string
  },
  // A list of all pending image shares with status
  readonly pendingImageShares: Array<TextileTypes.SharedImage>,
  // A map of threads and their pending images from pendingImageShares
  // An image may be shared to multiple threads before finishing upload, so required split
  readonly pendingThreadShares: { [index:string] : Array<string> }
}

export const initialState: UIState = {
  chosenProfilePhoto: {},
  viewingPhoto: {
    active: false
  },
  sharingPhoto: {
    active: false,
    selectedThreads: new Map<string, boolean>()
  },
  pendingImageShares: [],
  pendingThreadShares: {}
}

export function reducer (state: UIState = initialState, action: UIAction): UIState {
  switch (action.type) {
    case getType(actions.chooseProfilePhotoSuccess):
    case getType(actions.chooseProfilePhotoError):
      return { ...state, chosenProfilePhoto: { ...state.chosenProfilePhoto, ...action.payload } }
    case getType(actions.viewPhotoRequest):
      const { photoId, threadId } = action.payload
      return { ...state, viewingPhoto: { ...state.viewingPhoto, active: true, photoId, threadId } }
    case getType(actions.switchViewdPhoto):
      return { ...state, viewingPhoto: { ...state.viewingPhoto, photoId: action.payload } }
    case getType(actions.dismissViewedPhoto):
      return { ...state, viewingPhoto: { ...state.viewingPhoto, active: false } }
    case getType(actions.authorPhotoShareRequest):
      return { ...state, sharingPhoto: { ...state.sharingPhoto, active: true, hash: action.payload, selectedThreads: new Map<string, boolean>() } }
    case getType(actions.cancelAuthoringPhotoShare):
      return { ...state, sharingPhoto: { ...state.sharingPhoto, active: false } }
    case getType(actions.updateSelectedThreads):
      return { ...state, sharingPhoto: { ...state.sharingPhoto, selectedThreads: action.payload.threadIds } }
    case getType(actions.updateComment):
      return { ...state, sharingPhoto: { ...state.sharingPhoto, comment: action.payload } }
    case getType(actions.imagePickerSuccess):
      const { image } = action.payload
      // if the image already exists as a pending invite to the thread... skip it
      if (action.payload.threadId in state.pendingThreadShares) {
        if (state.pendingThreadShares[action.payload.threadId].find((uri) => uri === image.uri)) {
          return state
        }
      }

      if (!state.pendingImageShares.find((img) => img.uri === image.uri)) {
        // if the image doesn't already exist, add it to our state

      } else {
        // otherwise, just add the ia

      }

      console.log('THREAD PICKER', action.payload.threadId)
      return state
    default:
      return state
  }
}

export default actions
