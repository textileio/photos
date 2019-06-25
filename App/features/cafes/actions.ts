import { createAsyncAction } from 'typesafe-actions'

import { DiscoveredCafes } from '../../Services/textile-lb-api'

// In typesafe-actions v3.x.x, void is used for an action that takes no parameters
// this needs to be changed to undefined upon upgrading to v4.x.x
export const getRecommendedCafes = createAsyncAction(
  'cafes/GET_RECOMMENDED_CAFES_REQUEST',
  'cafes/GET_RECOMMENDED_CAFES_SUCCESS',
  'cafes/GET_RECOMMENDED_CAFES_ERROR'
)<void, DiscoveredCafes, any>()
