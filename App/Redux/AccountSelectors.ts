import { RootState } from './Types'
import { pb } from '@textile/react-native-sdk'

/**
 * Returns the Account Address
 * Used to filter Account Thread out of Thread lists for display
 * Account Thread Key === Account Address
 */
export function getPeerId (state: RootState): string | undefined {
  return state.account.peerId.value
}

export function getAddress (state: RootState): string | undefined {
  return state.account.profile.value &&
         state.account.profile.value.address
}

export function getUsername (state: RootState): string | undefined {
  return state.account.profile.value &&
         state.account.profile.value.username
}

export function bestSession(state: RootState): pb.CafeSession.AsObject | undefined {
  const values = state.account.cafeSessions.sessions
  if (values.length === 0) {
    return undefined
  }
  const sorted = values.slice().sort((a, b) => {
    const aExpiry = new Date(getSessionMillis(a)).getTime()
    const bExpiry = new Date(getSessionMillis(b)).getTime()
    return aExpiry - bExpiry
  })
  return sorted.pop()
}

export function getSessionMillis(session: pb.CafeSession.AsObject): number {
  if (!session.exp || !session.exp.seconds || !session.exp.nanos) {
    return 0
  }
  return (session.exp.seconds as number) * 1e3 + session.exp.nanos / 1e6
}

export function initialized(state: RootState) {
  return state.account.initialized
}
