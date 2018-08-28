import { createAction, ActionType, getType } from 'typesafe-actions'
import {
  BlockId,
  PhotoId,
  SharedImage,
  ThreadId,
  ThreadName
} from '../Models/TextileTypes'

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
  updateSharingPhotoImage: createAction('UPDATE_SHARING_PHOTO_IMAGE', resolve => {
    return (image: SharedImage | string) => resolve({ image })
  }),
  updateSharingPhotoThread: createAction('UPDATE_SHARING_PHOTO_THREAD', resolve => {
    return (threadId: ThreadId) => resolve({ threadId })
  }),
  updateSharingPhotoComment: createAction('UPDATE_SHARING_PHOTO_COMMENT', resolve => {
    return (comment: string) => resolve({ comment })
  }),
  sharePhotoRequest: createAction('SHARE_PHOTO_REQUEST', resolve => {
    return (image?: SharedImage | PhotoId, threadId?: ThreadId, comment?: string) => resolve({ image, threadId, comment })
  }),
  sharePhotoToNewThreadRequest: createAction('SHARE_PHOTO_TO_NEW_THREAD_REQUEST', resolve => {
    return (imageId: PhotoId, threadName: ThreadName, comment?: string) => resolve({ imageId, threadName, comment })
  }),
  cancelSharingPhoto: createAction('CANCEL_SHARING_PHOTO', resolve => {
    return () => resolve()
  }),
  imageSharingError: createAction('IMAGE_SHARING_ERROR', resolve => {
    return (error: Error) => resolve(error)
  }),
  getPublicLink: createAction('GET_PUBLIC_LINK', resolve => {
    return (photoId: PhotoId) => resolve({ photoId })
  }),
  showImagePicker: createAction('SHOW_IMAGE_PICKER', resolve => {
    return (threadId: ThreadId) => resolve({ threadId })
  }),
  newImagePickerSelection: createAction('NEW_IMAGE_PICKER_SELECTION', resolve => {
    return (threadId: ThreadId) => resolve({ threadId })
  }),
  newImagePickerError: createAction('NEW_IMAGE_PICKER_ERROR', resolve => {
    return (error: Error, message?: string) => resolve({ error, message })
  }),
  dismissImagePickerError: createAction('DISMISS_IMAGE_PICKER_ERROR', resolve => {
    return () => resolve()
  }),
  routeDeepLinkRequest: createAction('ROUTE_DEEP_LINK_REQUEST', resolve => {
    return (url: string) => resolve({url})
  }),
  addFriendRequest: createAction('ADD_FRIEND_REQUEST', resolve => {
    return (threadId: ThreadId, threadName: ThreadName) => resolve({threadId, threadName})
  }),
  addLikeRequest: createAction('ADD_LIKE_REQUEST', resolve => {
    return (blockId: BlockId) => resolve({blockId})
  })
}

export type UIAction = ActionType<typeof actions>

export type UIState = {
  readonly chosenProfilePhoto: {
    readonly uri?: string,
    readonly data?: string
    readonly error?: Error
  }
  readonly sharingPhoto?: {
    readonly image?: SharedImage | string,
    readonly threadId?: ThreadId,
    readonly comment?: string
  },
  readonly imagePickerError?: string // used to notify the user of any error during photo picking
}

export const initialState: UIState = {
  chosenProfilePhoto: {},
}

export function reducer (state: UIState = initialState, action: UIAction): UIState {
  switch (action.type) {
    case getType(actions.chooseProfilePhotoSuccess):
    case getType(actions.chooseProfilePhotoError):
      return { ...state, chosenProfilePhoto: { ...state.chosenProfilePhoto, ...action.payload } }
    case getType(actions.updateProfilePicture):
    case getType(actions.cancelProfileUpdate):
      return { ...state, chosenProfilePhoto: {} }
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
    case getType(actions.sharePhotoToNewThreadRequest):
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

export const UISelectors = {
}

export default actions
