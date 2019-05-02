import Textile, { IContact, ICafeSession } from '@textile/react-native-sdk'

import { RootState } from './Types'

/**
 * Returns the Account Address
 * Used to filter Account Thread out of Thread lists for display
 * Account Thread Key === Account Address
 */
export function getPeerId(state: RootState): string | undefined {
  return state.account.peerId.value
}

export function getAddress(state: RootState): string | undefined {
  return state.account.address && state.account.address.value
}

export function getUsername(state: RootState): string | undefined {
  return state.account.profile.value &&
         state.account.profile.value.name
}

export function getProfile(state: RootState): IContact | undefined {
  return state.account.profile.value
}

export function getRecoveryPhrase(state: RootState): string | undefined {
  return state.account.recoveryPhrase
}

export function bestSession(state: RootState): ICafeSession | undefined {
  const values = state.account.cafeSessions.sessions
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
