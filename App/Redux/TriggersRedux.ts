import { createAction } from 'typesafe-actions'
import * as TextileTypes from '../Models/TextileTypes'

const actions = {
  backgroundTask: createAction('BACKGROUND_TASK'),
  locationUpdate: createAction('LOCATION_UPDATE'),
  newEngagement: createAction('NOTIFICATION_ENGAGEMENT', resolve => {
    return (engagement: TextileTypes.NotificationEngagement) => resolve({ engagement: engagement })
  }),
  routeDeepLinkRequest: createAction('ROUTE_DEEP_LINK_REQUEST', resolve => {
    return (url: string) => resolve({ url })
  })
}

export default actions
