import Textile from '@textile/react-native-sdk'

import { AccountState } from './reducer'

export const getPeerId = (state: AccountState) => state.peerId.value

export const getAddress = (state: AccountState) => state.address.value

export const getUsername = (state: AccountState) =>
  state.profile.value && state.profile.value.name

export const getProfile = (state: AccountState) => state.profile.value

export const getRecoveryPhrase = (state: AccountState) => state.recoveryPhrase

export const makeSessionForId = (id: string) => (state: AccountState) => state.cafeSessions.sessions.find(session => session.id === id)

export const bestSession = (state: AccountState) => {
  const values = state.cafeSessions.sessions
  if (values.length === 0) {
    return undefined
  }
  const sorted = values.slice().sort((a, b) => {
    const aExpiry = Textile.util.timestampToDate(a.exp).getTime()
    const bExpiry = Textile.util.timestampToDate(b.exp).getTime()
    return aExpiry - bExpiry
  })
  return sorted.pop()
}
