import { createAction, ActionType, getType } from 'typesafe-actions'
import { SharedImage } from '../Models/TextileTypes'
import { RootState } from '../Redux/Types'

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
  updateProfilePicture: createAction('UPDATE_PROFILE_PICTURE', resolve => {
    return (uri: string) => resolve({ uri })
  }),
  cancelProfileUpdate: createAction('CANCEL_PROFILE_UPDATE', resolve => {
    return () => resolve()
  }),
  viewThreadRequest: createAction('VIEW_THREAD_REQUEST', resolve => {
    return (threadId: string, threadName: string) => resolve({ threadId, threadName })
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
  updateSharingPhotoImage: createAction('UPDATE_SHARING_PHOTO_IMAGE', resolve => {
    return (image: SharedImage | string) => resolve({ image })
  }),
  updateSharingPhotoThread: createAction('UPDATE_SHARING_PHOTO_THREAD', resolve => {
    return (threadId: string) => resolve({ threadId })
  }),
  updateSharingPhotoComment: createAction('UPDATE_SHARING_PHOTO_COMMENT', resolve => {
    return (comment: string) => resolve({ comment })
  }),
  sharePhotoRequest: createAction('SHARE_PHOTO_REQUEST', resolve => {
    return (image?: SharedImage | string, threadId?: string, comment?: string) => resolve({ image, threadId, comment })
  }),
  cancelSharingPhoto: createAction('CANCEL_SHARING_PHOTO', resolve => {
    return () => resolve()
  }),
  imageSharingError: createAction('IMAGE_SHARING_ERROR', resolve => {
    return (error: Error) => resolve(error)
  }),
  getPublicLink: createAction('GET_PUBLIC_LINK', resolve => {
    return (photoId: string) => resolve({ photoId })
  }),
  showImagePicker: createAction('SHOW_IMAGE_PICKER', resolve => {
    return (threadId: string) => resolve({ threadId })
  }),
  newImagePickerSelection: createAction('NEW_IMAGE_PICKER_SELECTION', resolve => {
    return (threadId: string) => resolve({ threadId })
  }),
  newImagePickerError: createAction('NEW_IMAGE_PICKER_ERROR', resolve => {
    return (error: Error, message?: string) => resolve({ error, message })
  }),
  dismissImagePickerError: createAction('DISMISS_IMAGE_PICKER_ERROR', resolve => {
    return () => resolve()
  }),
  routeDeepLinkRequest: createAction('ROUTE_DEEP_LINK_REQUEST', resolve => {
    return (url: string) => resolve({url})
  })
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
  readonly sharingPhoto?: {
    readonly image?: SharedImage | string,
    readonly threadId?: string,
    readonly comment?: string
  },
  readonly imagePickerError?: string // used to notify the user of any error during photo picking
}

export const initialState: UIState = {
  chosenProfilePhoto: {},
  viewingPhoto: {
    active: false
  }
}

export function reducer (state: UIState = initialState, action: UIAction): UIState {
  switch (action.type) {
    case getType(actions.chooseProfilePhotoSuccess):
    case getType(actions.chooseProfilePhotoError):
      return { ...state, chosenProfilePhoto: { ...state.chosenProfilePhoto, ...action.payload } }
    case getType(actions.updateProfilePicture):
    case getType(actions.cancelProfileUpdate):
      return { ...state, chosenProfilePhoto: {} }
    case getType(actions.viewPhotoRequest):
      const { photoId, threadId } = action.payload
      return { ...state, viewingPhoto: { ...state.viewingPhoto, active: true, photoId, threadId } }
    case getType(actions.switchViewdPhoto):
      return { ...state, viewingPhoto: { ...state.viewingPhoto, photoId: action.payload } }
    case getType(actions.dismissViewedPhoto):
      return { ...state, viewingPhoto: { ...state.viewingPhoto, active: false } }
    case getType(actions.updateSharingPhotoImage):
      const { image } = action.payload
      return { ...state, sharingPhoto: { ...state.sharingPhoto, image } }
    case getType(actions.updateSharingPhotoThread): {
      const { threadId } = action.payload
      return { ...state, sharingPhoto: { ...state.sharingPhoto, threadId } }
    }
    case getType(actions.updateSharingPhotoComment):
      const { comment } = action.payload
      return { ...state, sharingPhoto: { ...state.sharingPhoto, comment } }
    case getType(actions.sharePhotoRequest):
    case getType(actions.cancelSharingPhoto):
      return { ... state, sharingPhoto: undefined }
    case getType(actions.newImagePickerError):
      const msg = action.payload.message || action.payload.error.message
      return { ...state, imagePickerError:  msg}
    case getType(actions.dismissImagePickerError):
      return { ...state, imagePickerError: undefined }
    default:
      return state
  }
}

export default actions
