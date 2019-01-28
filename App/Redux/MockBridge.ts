import { createAction, getType, ActionType } from 'typesafe-actions'

const actions = {
  appStateChange: createAction(
    '@bridge/APP_STATE_CHANGE',
    (resolve) => (previousState: string, newState: string) => resolve({ previousState, newState })
  ),
  newErrorMessage: createAction(
    '@bridge/NEW_ERROR_MESSAGE',
    (resolve) => (error: string) => resolve({ error })
  ),
  startNodeFinished: createAction(
    '@bridge/startNodeFinished',
    (resolve) => () => resolve()
  ),
  stopNodeAfterDelayStarting: createAction(
    '@bridge/stopNodeAfterDelayStarting',
    (resolve) => () => resolve()
  ),
  stopNodeAfterDelayCancelled: createAction(
    '@bridge/stopNodeAfterDelayCancelled',
    (resolve) => () => resolve()
  ),
  stopNodeAfterDelayFinishing: createAction(
    '@bridge/stopNodeAfterDelayFinishing',
    (resolve) => () => resolve()
  ),
  stopNodeAfterDelayComplete: createAction(
    '@bridge/stopNodeAfterDelayComplete',
    (resolve) => () => resolve()
  ),
  nodeOnline: createAction('@bridge/NODE_ONLINE', (resolve) => {
    return () => resolve()
  })
}

export type MockBridgeActions = ActionType<typeof actions>

export default actions
