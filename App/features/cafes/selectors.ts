import { CafesState } from './reducer'
import { Cafe } from './models'

export function makeCafeForPeerId(peerId: string) {
  return (state: CafesState) => state.cafes[peerId]
}

export function makeCafeSessionForPeerId(peerId: string) {
  return (state: CafesState) => state.cafeSessions.sessions[peerId]
}

export function registeringCafes(state: CafesState) {
  return Object.keys(state.cafes)
    .map(peerId => state.cafes[peerId])
    .filter(cafe => cafe.state === 'registering')
}

export function registeredCafes(state: CafesState) {
  return Object.keys(state.cafes)
    .map(peerId => state.cafes[peerId])
    .filter(cafe => cafe.state === 'registered')
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

export function knownCafes(state: CafesState) {
  return state.knownCafes ? state.knownCafes.list : []
}

export function knownCafesMap(state: CafesState) {
  const cafes = knownCafes(state)
  return cafes.reduce(
    (acc, current) => {
      return { ...acc, [current.peerId]: current }
    },
    {} as { [key: string]: Cafe | undefined }
  )
}
