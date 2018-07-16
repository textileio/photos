import { createAction, ActionType, getType } from 'typesafe-actions'

const actions = {
  startup: createAction('STARTUP', resolve => {
    return () => resolve()
  })
}

export type StartupAction = ActionType<typeof actions>

export default actions
