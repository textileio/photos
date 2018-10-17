import { createAction, ActionType, getType } from 'typesafe-actions'

import { ThreadId, Photo, PhotoId, ThreadName } from '../Models/TextileTypes'

const actions = {
  insertThread: createAction('INSERT_THREAD', (resolve) => {
    return (id: ThreadId, name: ThreadName) => resolve({ id, name })
  }),
  addThreadRequest: createAction('ADD_THREAD_REQUEST', (resolve) => {
    return (name: string, options?: { navigate?: boolean, selectToShare?: boolean, sharePhoto?: { imageId: PhotoId, comment?: string } }) => resolve({ name }, options)
  }),
  threadAdded: createAction('THREAD_ADDED', (resolve) => {
    return (id: ThreadId, name: ThreadName) => resolve({ id, name })
  }),
  addThreadError: createAction('ADD_THREAD_ERROR', (resolve) => {
    return (error: any) => resolve({ error })
  }),
  clearNewThreadActions: createAction('CLEAR_NEW_THREAD_ACTIONS'),
  removeThreadRequest: createAction('REMOVE_THREAD_REQUEST', (resolve) => {
    return (id: ThreadId) => resolve({ id })
  }),
  threadRemoved: createAction('THREAD_REMOVED', (resolve) => {
    return (id: ThreadId) => resolve({ id })
  }),
  removeThreadError: createAction('REMOVE_THREAD_ERROR', (resolve) => {
    return (error: any) => resolve({ error })
  }),
  refreshThreadsRequest: createAction('REFRESH_THREADS_REQUEST'),
  refreshThreadsError: createAction('REFRESH_THREADS_ERROR', (resolve) => {
    return (error: any) => resolve({ error })
  }),
  refreshThreadRequest: createAction('REFRESH_THREAD_REQUEST', (resolve) => {
    return (threadId: ThreadId) => resolve({ threadId })
  }),
  refreshThreadSuccess: createAction('REFRESH_THREAD_SUCCESS', (resolve) => {
    return (threadId: ThreadId, photos: Photo[]) => resolve({ threadId, photos })
  }),
  refreshThreadError: createAction('REFRESH_THREAD_ERROR', (resolve) => {
    return (threadId: ThreadId, error: any) => resolve({ threadId, error })
  }),
  viewWalletPhoto: createAction('VIEW_WALLET_PHOTO', (resolve) => {
    return (photoId: PhotoId) => resolve({ photoId })
  }),
  viewThread: createAction('VIEW_THREAD', (resolve) => {
    return (threadId: ThreadId) => resolve({ threadId })
  }),
  viewPhoto: createAction('VIEW_PHOTO', (resolve) => {
    return (photoId: PhotoId) => resolve({ photoId })
  }),
  updateComment: createAction('UPDATE_COMMENT', (resolve) => {
    return (comment: string) => resolve({ comment })
  }),
  addCommentRequest: createAction('ADD_COMMENT_REQUEST'),
  addCommentSuccess: createAction('ADD_COMMENT_SUCCESS')
}

export type PhotoViewingAction = ActionType<typeof actions>

export interface ThreadData {
  readonly id: ThreadId
  readonly name: ThreadName
  readonly querying: boolean
  readonly photos: ReadonlyArray<Photo>
  readonly error?: string
}

interface ThreadMap {
  readonly [key: string]: ThreadData | undefined
}

interface PhotoViewingState {
  readonly navigateToNewThread: boolean
  readonly selectToShare: boolean // if thread create should result in selecting it as share endpoint
  readonly shareToNewThread?: {
    threadName: string
    imageId: PhotoId
    comment?: string
  }
  readonly threads: ThreadMap
  readonly threadsError?: string
  readonly addingThread?: {
    readonly name: string
    readonly error?: string
  }
  readonly removingThread?: {
    readonly id: ThreadId
    readonly error?: string
  }
  readonly viewingWalletPhoto?: Photo
  readonly viewingThreadId?: ThreadId
  readonly viewingPhoto?: Photo
  readonly authoringComment?: string
}

const initialState: PhotoViewingState = {
  navigateToNewThread: false,
  selectToShare: false,
  threads: {}
}

export function reducer (state: PhotoViewingState = initialState, action: PhotoViewingAction): PhotoViewingState {
  switch (action.type) {
    case getType(actions.insertThread): {
      const { id, name } = action.payload
      if (state.threads[id]) {
        return state
      }
      return { ...state, threads: { ...state.threads, [id]: { id, name, querying: false, photos: [] } } }
    }
    case getType(actions.addThreadRequest): {
      const { name } = action.payload
      const { navigate, sharePhoto, selectToShare } = action.meta
      const shareToNewThread = sharePhoto ? { ...sharePhoto, threadName: name } : undefined
      return { ...state, navigateToNewThread: navigate || false, selectToShare: selectToShare || false, shareToNewThread, addingThread: { name }}
    }
    case getType(actions.threadAdded): {
      const { id, name } = action.payload
      if (state.threads[id]) {
        return state
      }
      const newThreadData: ThreadData = { id, name, querying: false, photos: [] }
      return { ...state, addingThread: undefined, threads: { ...state.threads, [id]: newThreadData } }
    }
    case getType(actions.addThreadError): {
      const { error } = action.payload
      if (!state.addingThread) {
        return state
      }
      const addingError = (error.message as string) || (error as string) || 'unknown'
      return { ...state, addingThread: { ...state.addingThread, error: addingError } }
    }
    case getType(actions.clearNewThreadActions): {
      return { ...state, navigateToNewThread: false, shareToNewThread: undefined }
    }
    case getType(actions.removeThreadRequest): {
      const { id } = action.payload
      return { ...state, removingThread: { id } }
    }
    case getType(actions.threadRemoved): {
      const { id } = action.payload
      const { [id]: removed, ...threads } = state.threads
      return { ...state, threads, removingThread: undefined }
    }
    case getType(actions.removeThreadError): {
      const { error } = action.payload
      if (!state.removingThread) {
        return state
      }
      const removingError = (error.message as string) || (error as string) || 'unknown'
      return { ...state, removingThread: { ...state.removingThread, error: removingError } }
    }
    case getType(actions.refreshThreadsError): {
      const { error } = action.payload
      const threadsError = (error.message as string) || (error as string) || 'unknown'
      return { ...state, threadsError }
    }
    case getType(actions.refreshThreadRequest): {
      const { threadId } = action.payload
      const threadData = state.threads[threadId]
      if (!threadData) {
        // We should always have threadData before a refreshThreadRequest, but just make sure.
        return state
      }
      const threads = { ...state.threads, [threadId]: { ...threadData, querying: true } }
      return { ...state, threads }
    }
    case getType(actions.refreshThreadSuccess): {
      const { threadId, photos } = action.payload
      const threadData = state.threads[threadId]
      if (!threadData) {
        // We should always have threadData before a refreshThreadSuccess, but just make sure.
        return state
      }
      const obj: ThreadData = { ...threadData, querying: false, photos }
      const threads: ThreadMap = { ...state.threads, [threadId]: obj }
      let viewingPhoto: Photo | undefined
      if (state.viewingThreadId === threadId && state.viewingPhoto) {
        const currentViewingPhoto = state.viewingPhoto
        viewingPhoto = photos.find((photo) => currentViewingPhoto.id === photo.id)
      }
      return { ...state, threads, viewingPhoto }
    }
    case getType(actions.refreshThreadError): {
      const { threadId, error } = action.payload
      const threadData = state.threads[threadId]
      if (!threadData) {
        // We should always have threadData before a refreshThreadError, but just make sure.
        return state
      }
      const threadError = (error.message as string) || (error as string) || 'unknown'
      const threads = { ...state.threads, [threadId]: { ...threadData, querying: false, error: threadError } }
      return { ...state, threads }
    }
    case getType(actions.viewWalletPhoto): {
      const { photoId } = action.payload
      const defaultThreadName: ThreadName = 'default' as any
      const defaultThreadData = Object.keys(state.threads)
        .map((key) => state.threads[key]! )
        .find((threadData) => threadData.name === defaultThreadName)
      if (!defaultThreadData) {
        return state
      }
      const viewingWalletPhoto = defaultThreadData.photos.find((photo) => photo.id === photoId)
      return { ...state, viewingWalletPhoto }
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
      const threadData = state.threads[state.viewingThreadId]
      const photos = threadData ? threadData.photos : []
      const photo = photos.find((photo) => photo.id === photoId)
      return { ...state, viewingPhoto: photo, authoringComment: undefined }
    }
    case getType(actions.updateComment): {
      const { comment } = action.payload
      return { ...state, authoringComment: comment }
    }
    case getType(actions.addCommentSuccess): {
      return { ...state, authoringComment: undefined }
    }
    default:
      return state
  }
}

export default actions
