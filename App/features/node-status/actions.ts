import { createAction } from 'typesafe-actions'

export const failedToInitializeNode = createAction(
  'node-status/FAILED_TO_INITIALIZE_NODE',
  resolve => (error: any) => resolve({ error })
)

export const nodeStarted = createAction('node-status/NODE_STARTED')

export const nodeStopped = createAction('node-status/NODE_STOPPED')

export const nodeOnline = createAction('node-status/NODE_ONLINE')

export const nodeFailedToStart = createAction(
  'node-status/NODE_FAILED_TO_START',
  resolve => (error: string) => resolve({ error })
)

export const nodeFailedToStop = createAction(
  'node-status/NODE_FAILED_TO_STOP',
  resolve => (error: string) => resolve({ error })
)

export const stopNodeAfterDelayStarting = createAction(
  'node-status/STOP_NODE_AFTER_DELAY_STARTING',
  resolve => (delay: number) => resolve({ delay })
)

export const stopNodeAfterDelayCancelled = createAction(
  'node-status/STOP_NODE_AFTER_DELAY_CANCELLED'
)
