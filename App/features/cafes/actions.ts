import { createAsyncAction } from 'typesafe-actions'

import { DiscoveredCafes } from '../../Services/textile-lb-api'

interface RegisterCafeConfig {
  url: string
  token: string
  success?: () => void
}

// In typesafe-actions v3.x.x, void is used for an action that takes no parameters
// this needs to be changed to undefined upon upgrading to v4.x.x
export const getRecommendedCafes = createAsyncAction(
  'cafes/GET_RECOMMENDED_CAFES_REQUEST',
  'cafes/GET_RECOMMENDED_CAFES_SUCCESS',
  'cafes/GET_RECOMMENDED_CAFES_ERROR'
)<void, DiscoveredCafes, any>()

// Registering with a new cafe requires the cafe URL and string
// With the new SDK, the URL needs to be changed to the peer id
export const registerCafe = createAsyncAction(
  'cafes/REGISTER_CAFE_REQUEST',
  'cafes/REGISTER_CAFE_SUCCESS',
  'cafes/REGISTER_CAFE_ERROR'
)<
  RegisterCafeConfig,
  string,
  {
    url: string
    error: any
  }
>()

// Deregistering from a cafe requires the cafe's peer id
export const deregisterCafe = createAsyncAction(
  'cafes/DEREGISTER_CAFE_REQUEST',
  'cafes/DEREGISTER_CAFE_SUCCESS',
  'cafes/DEREGISTER_CAFE_ERROR'
)<
  string,
  string,
  {
    id: string
    error: any
  }
>()
