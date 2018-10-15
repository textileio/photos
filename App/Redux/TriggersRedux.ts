import { createAction, ActionType, getType } from 'typesafe-actions'

const actions = {
  backgroundFetch: createAction('BACKGROUND_FETCH'),
  locationUpdate: createAction('LOCATION_UPDATE')
}

export type TriggersAction = ActionType<typeof actions>

export default actions
