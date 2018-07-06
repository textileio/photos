import { createAction, ActionType, getType } from 'typesafe-actions'

const actions = {
  addThreadRequest: createAction('ADD_THREAD_REQUEST', resolve => {
    return (tmpId: string, name: string, mnemonic?: string) => resolve({ tmpId, name, mnemonic })
  }),
  addThreadSuccess: createAction('ADD_THREAD_SUCCESS', resolve => {
    return (tmpId: string, id: string) => resolve({ tmpId, id })
  }),
  addThreadError: createAction('ADD_THREAD_ERROR', resolve => {
    return (tmpId: string, error: Error) => resolve({ tmpId, error })
  }),
  removeThreadRequest: createAction('REMOVE_THREAD_REQUEST', resolve => {
    return (id: string) => resolve({ id })
  }),
  removeThreadSuccess: createAction('REMOVE_THREAD_SUCCESS', resolve => {
    return (id: string) => resolve({ id })
  }),
  removeThreadError: createAction('REMOVE_THREAD_ERROR', resolve => {
    return (id: string, error: Error) => resolve({ id, error })
  }),
  refreshThreadsRequest: createAction('REFRESH_THREADS_REQUEST', resolve => {
    return () => resolve()
  }),
  refreshThreadsSuccess: createAction('REFRESH_THREADS_SUCCESS', resolve => {
    return (threads: Threads) => resolve({ threads })
  }),
  refreshThreadsError: createAction('REFRESH_THREADS_ERROR', resolve => {
    return (error: Error) => resolve({ error })
  })
}

export type ThreadsAction = ActionType<typeof actions>

export type ThreadItem = {
  readonly id?: string
  readonly name: string
  readonly peers?: number
  readonly tmpId?: string
  readonly state: 'adding' | 'joined' | 'leaving'
  readonly error?: Error
}

export type Threads = {
  readonly items: ThreadItem[]
}

export type ThreadsState = {
  readonly refreshing: boolean
  readonly refreshError?: Error
  readonly threads: ReadonlyArray<ThreadItem>
}

export const initialState: ThreadsState = {
  refreshing: false,
  threads: []
}

export function reducer (state: ThreadsState = initialState, action: ThreadsAction): ThreadsState {
  switch (action.type) {
    case getType(actions.addThreadRequest): {
      const threads = Array.from(state.threads)
      threads.push({ tmpId: action.payload.tmpId, name: action.payload.name, state: 'adding' })
      return { ...state, threads }
    }
    case getType(actions.addThreadSuccess): {
      const threads = state.threads.map(thread => {
        if (thread.tmpId === action.payload.tmpId) {
          const updatedThread: ThreadItem = { ...thread, tmpId: undefined, id: action.payload.id, state: 'joined' }
          return updatedThread
        } else {
          return thread
        }
      })
      return { ...state, threads }
    }
    case getType(actions.addThreadError): {
      const threads = state.threads.map(thread => {
        if (thread.tmpId === action.payload.tmpId) {
          const updatedThread: ThreadItem = { ...thread, error: action.payload.error }
          return updatedThread
        } else {
          return thread
        }
      })
      return { ...state, threads }
    }
    case getType(actions.removeThreadRequest): {
      const threads = state.threads.map(thread => {
        if (thread.id === action.payload.id) {
          const updatedThread: ThreadItem = { ...thread, state: 'leaving' }
          return updatedThread
        } else {
          return thread
        }
      })
      return { ...state, threads }
    }
    case getType(actions.removeThreadSuccess): {
      const threads = state.threads.filter(thread => thread.id !== action.payload.id)
      return { ...state, threads }
    }
    case getType(actions.removeThreadError): {
      const threads = state.threads.map(thread => {
        if (thread.id === action.payload.id) {
          const updatedThread: ThreadItem = { ...thread, error: action.payload.error }
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
      return { ...state, refreshing: false, refreshError: undefined, threads: action.payload.threads.items }
    case getType(actions.refreshThreadsError):
      return { ...state, refreshing: false, refreshError: action.payload.error }
    default:
      return state
  }
}

export default actions
