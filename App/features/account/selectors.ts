import { AccountState } from './reducer'

export function getPeerId(state: AccountState) {
  return state.peerId.value
}

export function getAddress(state: AccountState) {
  return state.address.value
}

export function getUsername(state: AccountState) {
  return state.profile.value && state.profile.value.name
}

export function getProfile(state: AccountState) {
  return state.profile.value
}

export function getRecoveryPhrase(state: AccountState) {
  return state.recoveryPhrase
}
