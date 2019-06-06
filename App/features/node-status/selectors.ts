import { NodeStatusState } from './reducer'
import { NodeState } from './models'

export const nodeState = (state: NodeStatusState) => state.state

export const started = (state: NodeStatusState) =>
  state.state === NodeState.started || state.state === NodeState.online

export const online = (state: NodeStatusState) =>
  state.state === NodeState.online
