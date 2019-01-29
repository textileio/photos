import { take, put, call, all } from 'redux-saga/effects'
import { ActionType, getType } from 'typesafe-actions'
import Store from './store'
// import AccountActions from '../../Redux/AccountRedux'
import {
  cafeSessions,
  refreshCafeSession,
  peerId,
  profile,
  setAvatar as updateAvatar,
  setUsername as username,
  ContactInfo,
  CafeSession
} from '@textile/react-native-sdk'

const store = new Store()
export async function * refreshProfile () {
  const newProfile = await profile()
  store.setAccountProfile(newProfile)
}

export async function * refreshPeerId () {
  const newPeerId = await peerId()
  store.setPeerId(newPeerId)
}

export async function * setUsername (newUsername: string) {
  await username(newUsername)
  const newProfile = await profile()
  store.setAccountProfile(newProfile)
}

export async function * setAvatar (hash: string) {
  await updateAvatar(hash)
}

export async function * refreshCafeSessions () {
  const sessions: ReadonlyArray<CafeSession> = await cafeSessions()
  const effects = sessions.map((session) => refreshCafeSession(session.id))
  const refreshedSessions: ReadonlyArray<CafeSession> = await Promise.all(effects)
  return refreshedSessions
}

export function * getCafeSessions () {
  const sessions: ReadonlyArray<CafeSession> = yield call(cafeSessions)
  return sessions
}
