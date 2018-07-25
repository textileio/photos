import { createAction } from 'typesafe-actions'

const actions = {
  backgroundTask: createAction('BACKGROUND_TASK'),
  locationUpdate: createAction('LOCATION_UPDATE')
}

export default actions
