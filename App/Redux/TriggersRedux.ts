import { createAction } from 'typesafe-actions'
import * as TextileTypes from '../Models/TextileTypes'

const actions = {
  backgroundTask: createAction('BACKGROUND_TASK'),
  locationUpdate: createAction('LOCATION_UPDATE'),
  newEngagement: createAction('NEW_NOTIFICATION_ENGAGEMENT', resolve => {
    return (engagement: TextileTypes.NotificationEngagement) => resolve({ engagement: engagement })
  })
}

export default actions
