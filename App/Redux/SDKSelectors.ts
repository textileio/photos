import { RootState } from './Types'

export function getNodeState (state: RootState) {
  return state.textileNode.nodeState.state
}
