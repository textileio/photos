import { createAction, ActionType, getType } from 'typesafe-actions'
import { RootState } from './Types'
import { CafeSessions, CafeSession } from '../NativeModules/Textile'

const actions = {
  getSessionsRequest: createAction('GET_SESSIONS_REQUEST'),
  getSessionsSuccess: createAction('GET_SESSIONS_SUCCESS', (resolve) => (sessions: CafeSessions) => resolve({ sessions })),
  getSessionsFailure: createAction('GET_SESSIONS_FAILURE', (resolve) => (error: any) => resolve({ error })),
  refreshSessionRequest: createAction('REFRESH_SESSION_REQUEST', (resolve) => (cafeId: string) => resolve({ cafeId })),
  refreshSessionSuccess: createAction('REFRESH_SESSION_SUCCESS', (resolve) => (session: CafeSession) => resolve({ session })),
  refreshSessionFailure: createAction('REFRESH_SESSION_FAILURE', (resolve) => (cafeId: string, error: any) => resolve({ cafeId, error })),
  dismissError: createAction('DISMISS_ERROR', (resolve) => {
    return () => resolve()
  }),
  requestCameraPermissions: createAction('REQUEST_CAMERA_PERMISSIONS', (resolve) => {
    return () => resolve()
  }),
  onboardWithInviteRequest: createAction('ONBOARD_WITH_INVITE_REQUEST', (resolve) => {
    return (url: string, hash: string, referral: string ) => resolve( { url, hash, referral } )
  })
}

export type AuthAction = ActionType<typeof actions>

// An email verification regexp when we need it
// const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

interface SessionData {
  readonly processing: boolean
  readonly session?: CafeSession
  readonly error?: string
}

interface Sessions {
  readonly [index: string]: SessionData
}

interface SessionsData {
  readonly processing: boolean
  readonly sessions: Sessions
  readonly error?: string
}

export interface AuthState {
  readonly processing: boolean
  readonly error?: string
  readonly sessionsData: SessionsData
  readonly invite?: {
    readonly url: string
    readonly hash: string
    readonly referral: string
  }
}

export const initialState: AuthState = {
  processing: false,
  sessionsData: {
    processing: false,
    sessions: {}
  }
}

export function reducer (state: AuthState = initialState, action: AuthAction): AuthState {
  switch (action.type) {
    case getType(actions.getSessionsRequest):
      return { ...state, sessionsData: { ...state.sessionsData, processing: true } }
    case getType(actions.getSessionsSuccess): {
      const { items } = action.payload.sessions
      const sessionsData = items.reduce((accum, session) => ({ ...accum, [session.cafe_id]: { session } }), { sessions: {}, processing: false } as SessionsData)
      return { ...state, processing: false, sessionsData }
    }
    case getType(actions.getSessionsFailure): {
      const { error } = action.payload
      const message = error.message && error.message as string ? error.message as string : error as string || 'unknown error'
      return { ...state, processing: false, sessionsData: { processing: false, sessions: {}, error: message } }
    }
    case getType(actions.refreshSessionRequest): {
      const { cafeId } = action.payload
      const oldSessionData = state.sessionsData.sessions[cafeId]
      const sessionData: SessionData = { ...oldSessionData, processing: true }
      const sessionsData: SessionsData = { ...state.sessionsData, [cafeId]: sessionData }
      return { ...state, sessionsData }
    }
    case getType(actions.refreshSessionSuccess): {
      const { session } = action.payload
      const sessionData: SessionData = { processing: false, session }
      const sessionsData: SessionsData = { ...state.sessionsData, [session.cafe_id]: sessionData }
      return { ...state, sessionsData }
    }
    case getType(actions.refreshSessionFailure): {
      const { cafeId, error } = action.payload
      const oldSessionData = state.sessionsData.sessions[cafeId]
      const message = error.message && error.message as string ? error.message as string : error as string || 'unknown error'
      const sessionData: SessionData = { processing: false, error: message }
      const sessionsData: SessionsData = { ...state.sessionsData, [cafeId]: sessionData }
      return { ...state, sessionsData }
    }
    case getType(actions.dismissError):
      return { ...state, error: undefined }
    case getType(actions.onboardWithInviteRequest):
      return { ...state, invite: action.payload }
    default:
      return state
  }
}

export const AuthSelectors = {
  sessions: (state: RootState) => state.auth.sessions,
  invite: (state: RootState) => state.auth.invite
}

export default actions
