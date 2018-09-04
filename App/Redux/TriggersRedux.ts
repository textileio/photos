import { createAction, ActionType, getType } from 'typesafe-actions'
import * as TextileTypes from '../Models/TextileTypes'

const actions = {
  backgroundTask: createAction('BACKGROUND_TASK'),
  locationUpdate: createAction('LOCATION_UPDATE')
}

export type TriggersAction = ActionType<typeof actions>

export default actions
