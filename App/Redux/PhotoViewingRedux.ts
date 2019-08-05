import { createAction, ActionType, getType } from 'typesafe-actions'
import { IFiles } from '@textile/react-native-sdk'

const actions = {
  addCommentRequest: createAction('ADD_COMMENT_REQUEST'),
  addCommentSuccess: createAction('ADD_COMMENT_SUCCESS'),
  addCommentError: createAction('ADD_COMMENT_ERROR'),
  getRecentPhotosSuccess: createAction('GET_RECENT_PHOTOS_SUCCESS', resolve => {
    return (photos: ReadonlyArray<IFiles>) =>
      resolve({ photos })
  }),
  updateComment: createAction('UPDATE_COMMENT', resolve => {
    return (comment: string) => resolve({ comment })
  }),
  viewPhoto: createAction('VIEW_PHOTO', resolve => {
    return (photoId: string) => resolve({ photoId })
  }),
  viewThread: createAction('VIEW_THREAD', resolve => {
    return (threadId: string) => resolve({ threadId })
  }),
  viewWalletPhoto: createAction('VIEW_WALLET_PHOTO', resolve => {
    return (photoId: string) => resolve({ photoId })
  })
}

export type PhotoViewingAction = ActionType<typeof actions>

interface Fake {
  readonly [key: string]: {key: string}
}

interface PhotoViewingState {
  readonly viewingWalletPhoto?: string
  readonly viewingThreadId?: string
  readonly viewingPhoto?: string
  readonly authoringComment?: string
  readonly authoringCommentError?: boolean
  readonly recentPhotos: ReadonlyArray<IFiles>
}

const initialState: PhotoViewingState = {
  recentPhotos: []
}

export function reducer(
  state: PhotoViewingState = initialState,
  action: PhotoViewingAction
): PhotoViewingState {
  switch (action.type) {
    case getType(actions.getRecentPhotosSuccess): {
      const { photos } = action.payload
      return { ...state, recentPhotos: photos }
    }
    case getType(actions.viewWalletPhoto): {
      const { photoId } = action.payload
      // const defaultThreadData = Object.keys(state.threads)
      //   .map(key => state.threads[key]!)
      //   .find(
      //     threadData =>
      //       threadData.key === Config.RN_TEXTILE_CAMERA_ROLL_THREAD_KEY
      //   )
      // if (!defaultThreadData) {
      //   return state
      // }
      // const viewingWalletPhoto = defaultThreadData.photos.find(
      //   photo => photo === photoId
      // )
      return { ...state, viewingWalletPhoto: photoId }
    }
    case getType(actions.viewThread): {
      const { threadId } = action.payload
      return { ...state, viewingThreadId: threadId }
    }
    case getType(actions.viewPhoto): {
      const { photoId } = action.payload
      if (!state.viewingThreadId) {
        return state
      }
      // const threadData = state.threads[state.viewingThreadId]
      // const photos = threadData ? threadData.photos : []
      // const photo = undefined //photos.find(photo => photo === photoId)
      return {
        ...state,
        viewingPhoto: photoId,
        authoringComment: undefined,
        authoringCommentError: undefined
      }
    }
    case getType(actions.updateComment): {
      const { comment } = action.payload
      return {
        ...state,
        authoringComment: comment,
        authoringCommentError: undefined
      }
    }
    case getType(actions.addCommentSuccess): {
      return {
        ...state,
        authoringComment: undefined,
        authoringCommentError: undefined
      }
    }
    case getType(actions.addCommentError): {
      return { ...state, authoringCommentError: true }
    }
    default:
      return state
  }
}

export default actions
