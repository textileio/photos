import Textile, { ICafeSession } from '@textile/react-native-sdk'

import { CafesState } from './reducer'
import { statement } from '@babel/template'

export function makeCafeForPeerId(peerId: string) {
  return (state: CafesState) => state.cafes[peerId]
}

export function regesteringCafes(state: CafesState) {
  return Object.keys(state.cafes)
    .map(peerId => state.cafes[peerId])
    .filter(cafe => cafe.state === 'registering')
}

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
