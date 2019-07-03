import { createAction, ActionType, getType } from 'typesafe-actions'

const actions = {
  backgroundFetch: createAction('BACKGROUND_FETCH')
}

export type TriggersAction = ActionType<typeof actions>

export default actions
