import { createAsyncAction } from 'typesafe-actions'

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
    id: string
    success?: () => void
  },
  string,
  {
    id: string
    error: any
  }
>()
