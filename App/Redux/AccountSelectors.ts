import { RootState } from './Types'

/**
 * Returns the Account Address
 * Used to filter Account Thread out of Thread lists for display
 * Account Thread Key === Account Address
 */
export function getAddress (state: RootState): string | undefined {
  return state.account.profile.value &&
         state.account.profile.value.address
}

export function bestSession(state: RootState) {
  const allSessions = state.account.cafeSessions.sessions
  const sorted = allSessions.slice().sort((a, b) => {
    const aExpiry = new Date(a.expiry).getTime()
    const bExpiry = new Date(b.expiry).getTime()
    return aExpiry - bExpiry
  })
  const newest = sorted.pop()
  return newest
}
