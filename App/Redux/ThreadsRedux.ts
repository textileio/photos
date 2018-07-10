import { createAction, ActionType, getType } from 'typesafe-actions'
import * as TextileTypes from '../Models/TextileTypes'

const actions = {
  addThreadRequest: createAction('ADD_THREAD_REQUEST', resolve => {
    return (addId: string, name: string, mnemonic?: string) => resolve({ addId, name, mnemonic })
  }),
  addThreadSuccess: createAction('ADD_THREAD_SUCCESS', resolve => {
    return (addId: string, threadItem: TextileTypes.ThreadItem) => resolve({ addId, threadItem })
  }),
  addThreadError: createAction('ADD_THREAD_ERROR', resolve => {
    return (addId: string, error: Error) => resolve({ addId, error })
  }),
  removeThreadRequest: createAction('REMOVE_THREAD_REQUEST', resolve => {
    return (threadId: string) => resolve({ threadId })
  }),
  removeThreadSuccess: createAction('REMOVE_THREAD_SUCCESS', resolve => {
    return (threadId: string) => resolve({ threadId })
  }),
  removeThreadError: createAction('REMOVE_THREAD_ERROR', resolve => {
    return (threadId: string, error: Error) => resolve({ threadId, error })
  }),
  refreshThreadsRequest: createAction('REFRESH_THREADS_REQUEST', resolve => {
    return () => resolve()
  }),
  refreshThreadsSuccess: createAction('REFRESH_THREADS_SUCCESS', resolve => {
    return (threads: TextileTypes.Threads) => resolve({ threads })
  }),
  refreshThreadsError: createAction('REFRESH_THREADS_ERROR', resolve => {
    return (error: Error) => resolve({ error })
  })
}

export type ThreadsAction = ActionType<typeof actions>

export type Thread = {
  readonly addId?: string
  readonly state: 'adding' | 'joined' | 'leaving'
  readonly error?: Error
  readonly threadItem?: TextileTypes.ThreadItem
}

export type ThreadsState = {
  readonly refreshing: boolean
  readonly refreshError?: Error
  readonly threads: ReadonlyArray<Thread>
}

export const initialState: ThreadsState = {
  refreshing: false,
  threads: []
}

export function reducer (state: ThreadsState = initialState, action: ThreadsAction): ThreadsState {
  switch (action.type) {
    case getType(actions.addThreadRequest): {
      const { addId } = action.payload
      const threads = state.threads.concat([{ addId, state: 'adding' }])
      return { ...state, threads }
    }
    case getType(actions.addThreadSuccess): {
      const { addId, threadItem } = action.payload
      const threads = state.threads.map(thread => {
        if (thread.addId === addId) {
          const updatedThread: Thread = { ...thread, addId: undefined, state: 'joined', threadItem }
          return updatedThread
        } else {
          return thread
        }
      })
      return { ...state, threads }
    }
    case getType(actions.addThreadError): {
      const { addId, error } = action.payload
      const threads = state.threads.map(thread => {
        if (thread.addId === addId) {
          const updatedThread: Thread = { ...thread, error }
          return updatedThread
        } else {
          return thread
        }
      })
      return { ...state, threads }
    }
    case getType(actions.removeThreadRequest): {
      const { threadId } = action.payload
      const threads = state.threads.map(thread => {
        if (thread.threadItem && thread.threadItem.id === threadId) {
          const updatedThread: Thread = { ...thread, state: 'leaving' }
          return updatedThread
        } else {
          return thread
        }
      })
      return { ...state, threads }
    }
    case getType(actions.removeThreadSuccess): {
      const { threadId } = action.payload
      const threads = state.threads.filter(thread => thread.threadItem && thread.threadItem.id !== threadId)
      return { ...state, threads }
    }
    case getType(actions.removeThreadError): {
      const { threadId, error } = action.payload
      const threads = state.threads.map(thread => {
        if (thread.threadItem && thread.threadItem.id === threadId) {
          const updatedThread: Thread = { ...thread, error: action.payload.error }
          return updatedThread
        } else {
          return thread
        }
      })
      return { ...state, threads }
    }
    case getType(actions.refreshThreadsRequest):
      return { ...state, refreshing: true, refreshError: undefined }
    case getType(actions.refreshThreadsSuccess):
      const threads = action.payload.threads.items.map(threadItem => {
        const thread: Thread = { state: 'joined', threadItem }
        return thread
      })
      return { ...state, refreshing: false, refreshError: undefined, threads }
    case getType(actions.refreshThreadsError):
      return { ...state, refreshing: false, refreshError: action.payload.error }
    default:
      return state
  }
}

export default actions
