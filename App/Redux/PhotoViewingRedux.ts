import { createAction, ActionType, getType } from 'typesafe-actions'

import { ThreadId, Photo, PhotoId, Thread, ThreadName, Mnemonic } from '../Models/TextileTypes'

const actions = {
  addThreadRequest: createAction('ADD_THREAD_REQUEST', resolve => {
    return (name: ThreadName, mnemonic?: Mnemonic) => resolve({ name, mnemonic })
  }),
  addThreadSuccess: createAction('ADD_THREAD_SUCCESS', resolve => {
    return (thread: Thread) => resolve({ thread })
  }),
  addThreadError: createAction('ADD_THREAD_ERROR', resolve => {
    return (error: any) => resolve({ error })
  }),
  removeThreadRequest: createAction('REMOVE_THREAD_REQUEST', resolve => {
    return (id: ThreadId) => resolve({ id })
  }),
  removeThreadSuccess: createAction('REMOVE_THREAD_SUCCESS', resolve => {
    return (id: ThreadId) => resolve({ id })
  }),
  removeThreadError: createAction('REMOVE_THREAD_ERROR', resolve => {
    return (error: any) => resolve({ error })
  }),
  refreshThreadsRequest: createAction('REFRESH_THREADS_REQUEST'),
  refreshThreadsError: createAction('REFRESH_THREADS_ERROR', resolve => {
    return (error: any) => resolve({ error })
  }),
  refreshThreadRequest: createAction('REFRESH_THREAD_REQUEST', resolve => {
    return (threadId: ThreadId) => resolve({ threadId })
  }),
  refreshThreadSuccess: createAction('REFRESH_THREAD_SUCCESS', resolve => {
    return (threadId: ThreadId, photos: Photo[]) => resolve({ threadId, photos })
  }),
  refreshThreadError: createAction('REFRESH_THREAD_ERROR', resolve => {
    return (threadId: ThreadId, error: any) => resolve({ threadId, error })
  }),
  viewThread: createAction('VIEW_THREAD', resolve => {
    return (threadId: ThreadId) => resolve({ threadId })
  }),
  viewPhoto: createAction('VIEW_PHOTO', resolve => {
    return (photoId: PhotoId) => resolve({ photoId })
  }),
  updateComment: createAction('UPDATE_COMMENT', resolve => {
    return (comment: string) => resolve({ comment })
  }),
  addCommentRequest: createAction('ADD_COMMENT_REQUEST')
}

export type PhotoViewingAction = ActionType<typeof actions>

export type ThreadData = {
  readonly thread: Thread
  readonly querying: boolean
  readonly photos: ReadonlyArray<Photo>
  readonly error?: Error
}

type ThreadMap = {
  readonly [key: string]: ThreadData | undefined
}

type PhotoViewingState = {
  readonly threads: ThreadMap,
  readonly threadsError?: string
  readonly addingThread?: {
    readonly name: ThreadName,
    readonly error?: string
  }
  readonly removingThread?: {
    readonly id: ThreadId
    readonly error?: string
  }
  readonly viewingThread?: Thread,
  readonly viewingPhoto?: Photo,
  readonly authoringComment?: string
}

const initialState: PhotoViewingState = {
  threads: {}
}

export function reducer (state: PhotoViewingState = initialState, action: PhotoViewingAction): PhotoViewingState {
  switch (action.type) {
    case getType(actions.addThreadRequest): {
      const { name } = action.payload
      return { ...state, addingThread: { name }}
    }
    case getType(actions.addThreadSuccess): {
      const { thread } = action.payload
      return { ...state, addingThread: undefined, threads: { ...state.threads, [thread.id as string]: { thread, querying: false, photos: [] } } }
    }
    case getType(actions.addThreadError): {
      const { error } = action.payload
      if (!state.addingThread)
        return state
      const addingError = (error.message as string) || (error as string) || 'unknown'
      return { ...state, addingThread: { ...state.addingThread, error: addingError } }
    }
    case getType(actions.removeThreadRequest): {
      const { id } = action.payload
      return { ...state, removingThread: { id } }
    }
    case getType(actions.removeThreadSuccess): {
      const { id } = action.payload
      const { [id]: removed, ...threads } = state.threads
      return { ...state, threads, removingThread: undefined }
    }
    case getType(actions.removeThreadError): {
      const { error } = action.payload
      if (!state.removingThread)
        return state
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
      const threadData = state.threads[threadId] || createNewThreadData(threadId)
      const threads = { ...state.threads, [thread.id]: { ...threadData, querying: true } }
      return { ...state, threads }
    }
    case getType(actions.refreshThreadSuccess): {
      const { thread, photos } = action.payload
      const threadData = state.threads[thread.id]
      if (!threadData)
        return state
      const threads = { ...state.threads, [thread.id]: { ...threadData, querying: false, photos } }
      let viewingPhoto: Photo | undefined
      if (state.viewingThread && state.viewingThread === thread && state.viewingPhoto) {
        const currentViewingPhoto = state.viewingPhoto
        viewingPhoto = photos.find(photo => currentViewingPhoto.id === photo.id)
      }
      return { ...state, threads, viewingPhoto }
    }
    case getType(actions.refreshThreadError): {
      const { thread, error } = action.payload
      const threadData = state.threads[thread.id]
      if (!threadData)
        return state
      const threadError = (error.message as string) || (error as string) || 'unknown'
      const threads = { ...state.threads, [thread.id]: { ...threadData, querying: false, error: threadError } }
      return { ...state, threads }
    }
    case getType(actions.viewThread): {
      const { thread } = action.payload
      return { ...state, viewingThread: thread }
    }
    case getType(actions.viewPhoto): {
      const { photo } = action.payload
      return { ...state, viewingPhoto: photo, authoringComment: undefined }
    }
    case getType(actions.updateComment): {
      const { comment } = action.payload
      return { ...state, authoringComment: comment }
    }
    default:
      return state
  }
}

function createNewThreadData(thread: Thread): ThreadData {
  return {
    thread,
    photos: [],
    querying: false
  }
}

export default actions
