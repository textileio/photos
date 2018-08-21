import { createAction } from 'typesafe-actions'
import * as TextileTypes from '../Models/TextileTypes'

const actions = {
  backgroundTask: createAction('BACKGROUND_TASK'),
  locationUpdate: createAction('LOCATION_UPDATE')
}

export default actions
