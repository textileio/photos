import { createAsyncAction } from 'typesafe-actions'
import { ICafeSession } from '@textile/react-native-sdk'

// Registering with a new cafe requires the cafe URL and string
// With the new SDK, the URL needs to be changed to the peer id
export const registerCafe = createAsyncAction(
  'cafes/REGISTER_CAFE_REQUEST',
  'cafes/REGISTER_CAFE_SUCCESS',
  'cafes/REGISTER_CAFE_ERROR'
)<
  {
    peerId: string
    token: string
    success?: () => void
  },
  string,
  {
    peerId: string
    error: any
  }
>()

// Deregistering from a cafe requires the cafe's peer id
export const deregisterCafe = createAsyncAction(
  'cafes/DEREGISTER_CAFE_REQUEST',
  'cafes/DEREGISTER_CAFE_SUCCESS',
  'cafes/DEREGISTER_CAFE_ERROR'
)<
  {
    peerId: string
    success?: () => void
  },
  string,
  {
    peerId: string
    error: any
  }
>()

export const getCafeSessions = createAsyncAction(
  'account/GET_CAFE_SESSIONS_REQUEST',
  'account/GET_CAFE_SESSIONS_SUCCESS',
  'account/GET_CAFE_SESSIONS_FAILURE'
)<void, { sessions: ReadonlyArray<ICafeSession> }, { error: any }>()

export const refreshCafeSession = createAsyncAction(
  'account/REFRESH_CAFE_SESSION_REQUEST',
  'account/REFRESH_CAFE_SESSION_SUCCESS',
  'account/REFRESH_CAFE_SESSION_FAILURE'
)<
  { peerId: string },
  { session: ICafeSession },
  { peerId: string; error: any }
>()
