import { createAction, ActionType, getType } from 'typesafe-actions'

const actions = {
  addThreadRequest: createAction('ADD_THREAD_REQUEST', resolve => {
    return (tmpId: string, name: string) => resolve({ tmpId, name })
  }),
  addThreadSuccess: createAction('ADD_THREAD_SUCCESS', resolve => {
    return (tmpId: string, id: string) => resolve({ tmpId, id })
  }),
  addThreadError: createAction('ADD_THREAD_ERROR', resolve => {
    return (tmpId: string, error: Error) => resolve({ tmpId, error })
  }),
  leaveThreadRequest: createAction('LEAVE_THREAD_REQUEST', resolve => {
    return (id: string) => resolve({ id })
  }),
  leaveThreadSuccess: createAction('LEAVE_THREAD_SUCCESS', resolve => {
    return (id: string) => resolve({ id })
  }),
  leaveThreadError: createAction('LEAVE_THREAD_ERROR', resolve => {
    return (id: string, error: Error) => resolve({ id, error })
  }),
  refreshThreadsRequest: createAction('REFRESH_THREADS_REQUEST', resolve => {
    return () => resolve()
  }),
  refreshThreadsSuccess: createAction('REFRESH_THREADS_SUCCESS', resolve => {
    return (threads: Thread[]) => resolve({ threads })
  }),
  refreshThreadsError: createAction('REFRESH_THREADS_ERROR', resolve => {
    return (error: Error) => resolve({ error })
  })
}

export type ThreadsAction = ActionType<typeof actions>

export type Thread = {
  readonly tmpId?: string
  readonly id?: string
  readonly name: string
  readonly state: 'adding' | 'joined' | 'leaving'
  readonly error?: Error
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
      const threads = Array.from(state.threads)
      threads.push({ tmpId: action.payload.tmpId, name: action.payload.name, state: 'adding' })
      return { ...state, threads }
    }
    case getType(actions.addThreadSuccess): {
      const threads = state.threads.map(thread => {
        if (thread.tmpId === action.payload.tmpId) {
          const updatedThread: Thread = { ...thread, tmpId: undefined, id: action.payload.id, state: 'joined' }
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
          const updatedThread: Thread = { ...thread, error: action.payload.error }
          return updatedThread
        } else {
          return thread
        }
      })
      return { ...state, threads }
    }
    case getType(actions.leaveThreadRequest): {
      const threads = state.threads.map(thread => {
        if (thread.id === action.payload.id) {
          const updatedThread: Thread = { ...thread, state: 'leaving' }
          return updatedThread
        } else {
          return thread
        }
      })
      return { ...state, threads }
    }
    case getType(actions.leaveThreadSuccess): {
      const threads = state.threads.filter(thread => thread.id !== action.payload.id)
      return { ...state, threads }
    }
    case getType(actions.leaveThreadError): {
      const threads = state.threads.map(thread => {
        if (thread.id === action.payload.id) {
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
      return { ...state, refreshing: false, refreshError: undefined, threads: action.payload.threads }
    case getType(actions.refreshThreadsError):
      return { ...state, refreshing: false, refreshError: action.payload.error }
    default:
      return state
  }
}

export default actions
