import {
  cafeSession as session,
  cafeSessions as sessions,
  refreshCafeSession as refresh,
  CafeSession
} from '../NativeModules/Textile'

export async function bestCafeSession() {
  const allSessions = await sessions()
  const sorted = allSessions.items.slice().sort((a, b) => {
    const aExpiry = new Date(a.expiry).getTime()
    const bExpiry = new Date(b.expiry).getTime()
    return aExpiry - bExpiry
  })
  const newest = sorted.pop()
  if (newest && new Date() > new Date(newest.expiry)) {
    const refreshed = await refresh(newest.cafe_id)
    return refreshed
  } else {
    return newest
  }
}

export async function cafeSessions() {
  const s = await sessions()
  return s.items
}

export async function cafeSession(cafeId: string) {
  return await session(cafeId)
}

export async function refreshCafeSession(session: CafeSession) {
  return await refresh(session.cafe_id)
}

export async function refreshAllSessions() {
  const sessionsData = await sessions()
  const refreshedSessions = await Promise.all(sessionsData.items.map(async (session) => await refresh(session.cafe_id)))
  return refreshedSessions as ReadonlyArray<CafeSession>
}
