import { createAction, ActionType, getType } from 'typesafe-actions'

import { IFiles, Thread } from '@textile/react-native-sdk'

interface ThreadConfig {
  name: string
  type: Thread.Type
  sharing: Thread.Sharing
  whitelist: ReadonlyArray<string>
}

interface ThreadDescription extends ThreadConfig {
  id: string
  key: string
  initiator: string
  valid: boolean
}

// If a list of invites is included in ThreadOptions, send out those invites after
// the thread is created
interface ThreadOptions {
  navigate?: boolean
  selectToShare?: boolean
  sharePhoto?: {
    imageId: string
    comment?: string
  }
  invites?: ReadonlyArray<string>
}

const actions = {
  insertThread: createAction('INSERT_THREAD', resolve => {
    return (config: ThreadDescription) => resolve(config)
  }),
  addThreadRequest: createAction('ADD_THREAD_REQUEST', resolve => {
    return (config: ThreadConfig, options?: ThreadOptions) =>
      resolve(config, options)
  }),
  threadAddedNotification: createAction(
    'THREAD_ADDED_NOTIFICATION',
    resolve => {
      return (id: string) => resolve({ id })
    }
  ),
  threadAdded: createAction('THREAD_ADDED', resolve => {
    return (config: ThreadDescription) => resolve(config)
  }),
  addThreadError: createAction('ADD_THREAD_ERROR', resolve => {
    return (error: any) => resolve({ error })
  }),
  clearNewThreadActions: createAction('CLEAR_NEW_THREAD_ACTIONS'),
  removeThreadRequest: createAction('REMOVE_THREAD_REQUEST', resolve => {
    return (id: string) => resolve({ id })
  }),
  threadRemoved: createAction('THREAD_REMOVED', resolve => {
    return (id: string) => resolve({ id })
  }),
  removeThreadError: createAction('REMOVE_THREAD_ERROR', resolve => {
    return (error: any) => resolve({ error })
  }),
  refreshThreadsRequest: createAction('REFRESH_THREADS_REQUEST'),
  refreshThreadsError: createAction('REFRESH_THREADS_ERROR', resolve => {
    return (error: any) => resolve({ error })
  }),
  refreshThreadRequest: createAction('REFRESH_THREAD_REQUEST', resolve => {
    return (threadId: string) => resolve({ threadId })
  }),
  refreshThreadSuccess: createAction('REFRESH_THREAD_SUCCESS', resolve => {
    return (threadId: string, photos: ReadonlyArray<IFiles>) =>
      resolve({ threadId, photos })
  }),
  refreshThreadError: createAction('REFRESH_THREAD_ERROR', resolve => {
    return (threadId: string, error: any) => resolve({ threadId, error })
  }),
  updateThreadName: createAction('UPDATE_THREAD_NAME', resolve => {
    return (threadId: string, name: string) => resolve({ threadId, name })
  })
}

export type GroupsAction = ActionType<typeof actions>

export interface ThreadData {
  readonly id: string
  readonly key: string
  readonly name: string
  readonly querying: boolean
  // readonly photos: ReadonlyArray<string>
  readonly type: Thread.Type
  readonly sharing: Thread.Sharing
  readonly whitelist: ReadonlyArray<string>
  readonly initiator: string
  readonly thumb?: string
  readonly valid: boolean
  readonly size: number
  readonly updated?: number
  readonly error?: string
}

interface ThreadMap {
  readonly [key: string]: ThreadData | undefined
}

interface GroupsState {
  readonly navigateToNewThread: boolean
  readonly selectToShare: boolean // if thread create should result in selecting it as share endpoint
  readonly shareToNewThread?: {
    threadName: string
    imageId: string
    comment?: string
  }
  readonly threads: ThreadMap
  readonly threadsError?: string
  readonly addingThread?: {
    readonly name: string
    readonly error?: string
  }
  readonly removingThread?: {
    readonly id: string
    readonly error?: string
  }
}

const initialState: GroupsState = {
  navigateToNewThread: false,
  selectToShare: false,
  threads: {}
}

export function reducer(
  state: GroupsState = initialState,
  action: GroupsAction
): GroupsState {
  switch (action.type) {
    case getType(actions.insertThread): {
      const {
        id,
        key,
        name,
        type,
        sharing,
        whitelist,
        initiator,
        valid
      } = action.payload
      if (state.threads[id]) {
        return state
      }
      return {
        ...state,
        threads: {
          ...state.threads,
          [id]: {
            id,
            key,
            name,
            type,
            sharing,
            whitelist,
            initiator,
            valid,
            querying: false,
            size: 0
          }
        }
      }
    }
    case getType(actions.addThreadRequest): {
      const { name } = action.payload
      const { navigate, sharePhoto, selectToShare } = action.meta
      const shareToNewThread = sharePhoto
        ? { ...sharePhoto, threadName: name }
        : undefined
      return {
        ...state,
        navigateToNewThread: navigate || false,
        selectToShare: selectToShare || false,
        shareToNewThread,
        addingThread: { name }
      }
    }
    case getType(actions.threadAdded): {
      const {
        id,
        key,
        name,
        type,
        sharing,
        whitelist,
        initiator
      } = action.payload
      if (state.threads[id]) {
        return state
      }
      const newThreadData: ThreadData = {
        id,
        key,
        name,
        type,
        sharing,
        whitelist,
        initiator,
        valid: true,
        querying: false,
        size: 0
      }
      return {
        ...state,
        addingThread: undefined,
        threads: { ...state.threads, [id]: newThreadData }
      }
    }
    case getType(actions.addThreadError): {
      const { error } = action.payload
      if (!state.addingThread) {
        return state
      }
      const addingError =
        (error.message as string) || (error as string) || 'unknown'
      return {
        ...state,
        addingThread: { ...state.addingThread, error: addingError }
      }
    }
    case getType(actions.clearNewThreadActions): {
      return {
        ...state,
        navigateToNewThread: false,
        shareToNewThread: undefined
      }
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
      const removingError =
        (error.message as string) || (error as string) || 'unknown'
      return {
        ...state,
        removingThread: { ...state.removingThread, error: removingError }
      }
    }
    case getType(actions.refreshThreadsError): {
      const { error } = action.payload
      const threadsError =
        (error.message as string) || (error as string) || 'unknown'
      return { ...state, threadsError }
    }
    case getType(actions.refreshThreadRequest): {
      const { threadId } = action.payload
      const threadData = state.threads[threadId]
      if (!threadData) {
        // We should always have threadData before a refreshThreadRequest, but just make sure.
        return state
      }
      const threads = {
        ...state.threads,
        [threadId]: { ...threadData, querying: true }
      }
      return { ...state, threads }
    }
    case getType(actions.refreshThreadSuccess): {
      const { threadId, photos } = action.payload
      const threadData = state.threads[threadId]
      if (!threadData) {
        // We should always have threadData before a refreshThreadSuccess, but just make sure.
        return state
      }
      const updated = photos.length > 0 ? photos[0].date.nanos : undefined

      const thumb = photos.length > 0 ? photos[0].data : undefined

      const obj: ThreadData = {
        ...threadData,
        querying: false,
        size: photos.length,
        thumb,
        updated
      }

      const threads: ThreadMap = { ...state.threads, [threadId]: obj }

      return { ...state, threads }
    }
    case getType(actions.refreshThreadError): {
      const { threadId, error } = action.payload
      const threadData = state.threads[threadId]
      if (!threadData) {
        // We should always have threadData before a refreshThreadError, but just make sure.
        return state
      }
      const threadError =
        (error.message as string) || (error as string) || 'unknown'
      const threads = {
        ...state.threads,
        [threadId]: { ...threadData, querying: false, error: threadError }
      }
      return { ...state, threads }
    }
    case getType(actions.updateThreadName): {
      const { threadId, name } = action.payload
      const threadData = state.threads[threadId]
      if (!threadData) {
        // We should always have threadData before renaming a thread, but just make sure.
        return state
      }
      const threads = { ...state.threads, [threadId]: { ...threadData, name } }
      return { ...state, threads }
    }
    default:
      return state
  }
}

export default actions
