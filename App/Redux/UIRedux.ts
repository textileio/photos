import {
  createAction,
  createAsyncAction,
  ActionType,
  getType
} from 'typesafe-actions'
import { SharedImage } from '../features/group/add-photo/models'
import { RootState } from './Types'
import { IFiles } from '@textile/react-native-sdk'

const actions = {
  updateSharingPhotoImage: createAction(
    'UPDATE_SHARING_PHOTO_IMAGE',
    resolve => {
      return (image: SharedImage) => resolve({ image })
    }
  ),
  updateSharingPhotoFiles: createAction(
    'UPDATE_SHARING_PHOTO_FILES',
    resolve => {
      return (files: IFiles) => resolve({ files })
    }
  ),
  updateSharingPhotoThread: createAction(
    'UPDATE_SHARING_PHOTO_THREAD',
    resolve => {
      return (threadId: string) => resolve({ threadId })
    }
  ),
  updateSharingPhotoComment: createAction(
    'UPDATE_SHARING_PHOTO_COMMENT',
    resolve => {
      return (comment: string) => resolve({ comment })
    }
  ),
  sharePhotoRequest: createAction('SHARE_PHOTO_REQUEST', resolve => {
    return (image: string, threadId: string, comment?: string) =>
      resolve({ image, threadId, comment })
  }),
  cancelSharingPhoto: createAction('CANCEL_SHARING_PHOTO'),
  cleanupComplete: createAction('CLEANUP_COMPLETE'),
  imageSharingError: createAction('IMAGE_SHARING_ERROR', resolve => {
    return (error: Error) => resolve(error)
  }),
  shareByLink: createAction('SHARE_BY_LINK', resolve => {
    return (path: string) => resolve({ path })
  }),
  showImagePicker: createAction('SHOW_IMAGE_PICKER', resolve => {
    return (pickerType?: string) => resolve({ pickerType })
  }),
  showWalletPicker: createAction('SHOW_WALLET_PICKER', resolve => {
    return (threadId?: string) => resolve({ threadId })
  }),
  walletPickerSuccess: createAction('WALLET_PICKER_SUCCESS', resolve => {
    return (photo: IFiles) => resolve({ photo })
  }),
  newImagePickerSelection: createAction(
    'NEW_IMAGE_PICKER_SELECTION',
    resolve => {
      return (threadId: string) => resolve({ threadId })
    }
  ),
  newImagePickerError: createAction('NEW_IMAGE_PICKER_ERROR', resolve => {
    return (error: Error, message?: string) => resolve({ error, message })
  }),
  dismissImagePickerError: createAction(
    'DISMISS_IMAGE_PICKER_ERROR',
    resolve => {
      return () => resolve()
    }
  ),
  routeDeepLinkRequest: createAction('ROUTE_DEEP_LINK_REQUEST', resolve => {
    return (url: string) => resolve({ url })
  }),
  addFriendRequest: createAction('ADD_FRIEND_REQUEST', resolve => {
    return (threadId: string, threadName: string) =>
      resolve({ threadId, threadName })
  }),
  addLike: createAsyncAction(
    'ADD_LIKE_REQUEST',
    'ADD_LIKE_SUCCESS',
    'ADD_LIKE_FAILURE'
  )<
    { blockId: string },
    { blockId: string },
    { blockId: string; error: any }
  >(),
  navigateToThreadRequest: createAction(
    'NAVIGATE_TO_THREAD_REQUEST',
    resolve => {
      return (threadId: string, threadName: string) =>
        resolve({ threadId, threadName })
    }
  ),
  navigateToCommentsRequest: createAction(
    'NAVIGATE_TO_COMMENTS_REQUEST',
    resolve => {
      return (photoId: string, threadId?: string) =>
        resolve({ photoId, threadId })
    }
  ),
  navigateToLikesRequest: createAction('NAVIGATE_TO_LIKES_REQUEST', resolve => {
    return (photoId: string, threadId?: string) =>
      resolve({ photoId, threadId })
  })
}

export type UIAction = ActionType<typeof actions>

export interface SharingPhoto {
  readonly image?: SharedImage
  readonly files?: IFiles
  readonly threadId?: string
  readonly comment?: string
}

export interface UIState {
  readonly sharingPhoto?: SharingPhoto
  readonly likingPhotos: {
    [blockId: string]: {
      error?: string
    }
  }
  readonly imagePickerError?: string // used to notify the user of any error during photo picking
}

export const initialState: UIState = {
  likingPhotos: {}
}

export function reducer(
  state: UIState = initialState,
  action: UIAction
): UIState {
  switch (action.type) {
    case getType(actions.updateSharingPhotoImage): {
      const { image } = action.payload
      return { ...state, sharingPhoto: { ...state.sharingPhoto, image } }
    }
    case getType(actions.updateSharingPhotoFiles): {
      const { files } = action.payload
      return { ...state, sharingPhoto: { ...state.sharingPhoto, files } }
    }
    case getType(actions.updateSharingPhotoThread): {
      const { threadId } = action.payload
      return { ...state, sharingPhoto: { ...state.sharingPhoto, threadId } }
    }
    case getType(actions.updateSharingPhotoComment): {
      const { comment } = action.payload
      return { ...state, sharingPhoto: { ...state.sharingPhoto, comment } }
    }
    case getType(actions.sharePhotoRequest):
    case getType(actions.cleanupComplete):
      return { ...state, sharingPhoto: undefined }
    case getType(actions.newImagePickerError): {
      const msg = action.payload.message || action.payload.error.message
      return { ...state, imagePickerError: msg }
    }
    case getType(actions.dismissImagePickerError):
      return { ...state, imagePickerError: undefined }
    case getType(actions.addLike.request): {
      const { likingPhotos } = state
      const { blockId } = action.payload
      return {
        ...state,
        likingPhotos: {
          ...likingPhotos,
          [blockId]: {}
        }
      }
    }
    case getType(actions.addLike.failure):
    case getType(actions.addLike.success): {
      const { likingPhotos } = state
      const { blockId } = action.payload
      const {
        [action.payload.blockId]: liked,
        ...newLikingPhotos
      } = likingPhotos
      return {
        ...state,
        likingPhotos: newLikingPhotos
      }
    }
    default:
      return state
  }
}

export const UISelectors = {
  sharingPhoto: (state: RootState) => state.ui.sharingPhoto,
  sharingPhotoThread: (state: RootState) => {
    if (state.ui.sharingPhoto) {
      return state.ui.sharingPhoto.threadId
    }
    return
  },
  likingPhotos: (state: RootState) => state.ui.likingPhotos
}

export default actions
