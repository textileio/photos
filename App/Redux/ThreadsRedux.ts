import { createAction, ActionType, getType } from 'typesafe-actions'
import * as TextileTypes from '../Models/TextileTypes'

const actions = {
  addThreadRequest: createAction('ADD_THREAD_REQUEST', resolve => {
    return (name: string, mnemonic?: string) => resolve({ name, mnemonic })
  }),
  addThreadSuccess: createAction('ADD_THREAD_SUCCESS', resolve => {
    return (threadItem: TextileTypes.ThreadItem) => resolve({ threadItem })
  }),
  addThreadError: createAction('ADD_THREAD_ERROR', resolve => {
    return (error: Error) => resolve({ error })
  }),
  removeThreadRequest: createAction('REMOVE_THREAD_REQUEST', resolve => {
    return (threadId: string) => resolve({ threadId })
  }),
  removeThreadSuccess: createAction('REMOVE_THREAD_SUCCESS', resolve => {
    return (threadId: string) => resolve({ threadId })
  }),
  removeThreadError: createAction('REMOVE_THREAD_ERROR', resolve => {
    return (error: Error) => resolve({ error })
  }),
  refreshThreadsRequest: createAction('REFRESH_THREADS_REQUEST', resolve => {
    return () => resolve()
  }),
  refreshThreadsSuccess: createAction('REFRESH_THREADS_SUCCESS', resolve => {
    return (threads: TextileTypes.Threads) => resolve({ threads })
  }),
  refreshThreadsError: createAction('REFRESH_THREADS_ERROR', resolve => {
    return (error: Error) => resolve({ error })
  }),
  addExternalInviteRequest: createAction('ADD_EXTERNAL_THREAD_INVITE', resolve => {
    return (name: string, pubKey: string) => resolve({ name, pubKey })
  }),
  addExternalInviteSuccess: createAction('ADD_EXTERNAL_THREAD_INVITE_SUCCESS', resolve => {
    return (pubKey: string, link: string) => resolve({ pubKey, link })
  }),
  addExternalInviteError: createAction('ADD_EXTERNAL_THREAD_INVITE_ERROR', resolve => {
    return (error: Error) => resolve({ error })
  }),
  acceptExternalInviteRequest: createAction('ACCEPT_EXTERNAL_THREAD_INVITE', resolve => {
    return (link: string) => resolve({ link })
  }),
  acceptExternalInviteSuccess: createAction('ACCEPT_EXTERNAL_THREAD_INVITE_SUCCESS', resolve => {
    return () => resolve()
  }),
  acceptExternalInviteError: createAction('ACCEPT_EXTERNAL_THREAD_INVITE_ERROR', resolve => {
    return (error: Error) => resolve({ error })
  })
}

export type ThreadsAction = ActionType<typeof actions>

export type ThreadsState = {
  readonly refreshing: boolean
  readonly refreshError?: Error
  readonly adding?: {
    readonly name: string,
    readonly error?: Error
  }
  readonly removing?: {
    readonly threadId: string
    readonly error?: Error
  }
  readonly link?: {
    readonly pubKey: string
    readonly link?: string
    readonly error?: Error
  }
  readonly invite?: {
    readonly link: string
    readonly error?: Error
  }
  readonly threadItems: ReadonlyArray<TextileTypes.ThreadItem>
}

export const initialState: ThreadsState = {
  refreshing: false,
  threadItems: []
}

export function reducer (state: ThreadsState = initialState, action: ThreadsAction): ThreadsState {
  switch (action.type) {
    case getType(actions.addThreadRequest): {
      const { name } = action.payload
      return { ...state, adding: { name } }
    }
    case getType(actions.addThreadSuccess): {
      if (!state.adding) {
        return state
      }
      const { threadItem } = action.payload
      const threadItems = state.threadItems.concat([threadItem])
      return { ...state, adding: undefined, threadItems }
    }
    case getType(actions.addThreadError): {
      if (!state.adding) {
        return state
      }
      const { error } = action.payload
      return { ...state, adding: { ...state.adding, error } }
    }
    case getType(actions.removeThreadRequest): {
      const { threadId } = action.payload
      return { ...state, removing: { threadId } }
    }
    case getType(actions.removeThreadSuccess): {
      if (!state.removing) {
        return state
      }
      const { threadId } = action.payload
      const threadItems = state.threadItems.filter(thread => thread.id !== threadId)
      return { ...state, removing: undefined, threadItems }
    }
    case getType(actions.removeThreadError): {
      if (!state.removing) {
        return state
      }
      const { error } = action.payload
      return { ...state, removing: { ...state.removing, error } }
    }
    case getType(actions.refreshThreadsRequest):
      return { ...state, refreshing: true, refreshError: undefined }
    case getType(actions.refreshThreadsSuccess):
      const threadItems = action.payload.threads.items || []
      return { ...state, refreshing: false, refreshError: undefined, threadItems }
    case getType(actions.refreshThreadsError):
      return { ...state, refreshing: false, refreshError: action.payload.error }
    case getType(actions.addExternalInviteRequest): {
      // Store the link request pubKey in memory (name will be deprecated)
      const { name, pubKey } = action.payload
      return { ...state, link: { pubKey } }
    }
    case getType(actions.addExternalInviteSuccess): {
      if (!state.link) {
        return state
      }
      // Mark the link request with the newly created Link string
      const { pubKey, link } = action.payload
      return { ...state, link: { pubKey, link } }
    }
    case getType(actions.addExternalInviteError): {
      // Remove any pending link requests from memory
      if (!state.link) {
        return state
      }
      const { error } = action.payload
      return { ...state, link: { ...state.link, error } }
    }
    case getType(actions.acceptExternalInviteRequest): {
      // Store the external invite link in memory
      const { link } = action.payload
      return { ...state, invite: { link } }
    }
    case getType(actions.acceptExternalInviteSuccess): {
      if (!state.invite) {
        return state
      }
      // Clear the pending invites (we may want to turn this into a list long term)
      return { ...state, invite: undefined }
    }
    case getType(actions.acceptExternalInviteError): {
      // Remove any pending invites from memory
      if (!state.invite) {
        return state
      }
      const { error } = action.payload
      return { ...state, invite: { ...state.invite, error } }
    }
    default:
      return state
  }
}

export default actions
