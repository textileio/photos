import { pb, util } from '@textile/react-native-sdk'

import { RootState } from './Types'

/**
 * Returns the Account Address
 * Used to filter Account Thread out of Thread lists for display
 * Account Thread Key === Account Address
 */
export function getPeerId (state: RootState): string | undefined {
  return state.account.peerId.value
}

export function getAddress (state: RootState): string | undefined {
  return state.account.address.value
}

export function getUsername (state: RootState): string | undefined {
  return state.account.profile.value &&
         state.account.profile.value.username
}

export function bestSession(state: RootState): pb.ICafeSession | undefined {
  const values = state.account.cafeSessions.sessions
  if (values.length === 0) {
    return undefined
  }
  const sorted = values.slice().sort((a, b) => {
    const aExpiry = util.timestampToDate(a.exp).getTime()
    const bExpiry = util.timestampToDate(b.exp).getTime()
    return aExpiry - bExpiry
  })
  return sorted.pop()
}

export function initialized(state: RootState) {
  return state.account.initialized
}
