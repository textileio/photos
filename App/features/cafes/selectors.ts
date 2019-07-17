import Textile, { ICafeSession } from '@textile/react-native-sdk'

import { CafesState } from './reducer'

export function makeSessionForId(id: string) {
  return (state: CafesState) =>
    Object.keys(state.cafeSessions.sessions)
      .map(key => state.cafeSessions.sessions[key].session)
      .find(session => session.id === id)
}

export function sessions(state: CafesState) {
  return Object.keys(state.cafeSessions.sessions).map(
    key => state.cafeSessions.sessions[key].session
  )
}
