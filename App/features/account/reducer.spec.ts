import { IContact } from '@textile/react-native-sdk'

import * as actions from './actions'
import reducer from './reducer'
import { SharedImage } from '../group/add-photo/models'

const initialState = reducer(undefined, {} as any)
const profile: IContact = {
  address: 'address',
  name: 'username',
  avatar: 'avatar',
  peers: [],
  threads: []
}
const peerId = 'peerId'
const error = 'error'
const recoveryPhrase = 'recoveryPhrase'
const accountSeed = 'accountSeed'

describe('account', () => {
  describe('initial state', () => {
    it('should match snapshot', () => {
      expect(initialState).toMatchSnapshot()
    })
  })
  describe('profile', () => {
    it('should be processing from refresh', () => {
      const state0 = reducer(initialState, actions.refreshProfileRequest())
      expect(state0.profile.processing).toBeTruthy()
    })
    it('should be processing from setUsername', () => {
      const state0 = reducer(
        initialState,
        actions.setUsernameRequest('username')
      )
      expect(state0.profile.processing).toBeTruthy()
    })
    it('should update profile', () => {
      const state0 = reducer(
        initialState,
        actions.refreshProfileSuccess(profile)
      )
      expect(state0.profile.value).toEqual(profile)
      expect(state0.profile.processing).toBeFalsy()
    })
    it('should track profile error', () => {
      const state0 = reducer(initialState, actions.profileError(error))
      expect(state0.profile.error).toEqual(error)
      expect(state0.profile.processing).toBeFalsy()
    })
  })
  describe('peer id', () => {
    it('should not change state for request', () => {
      const state0 = reducer(initialState, actions.refreshPeerIdRequest())
      expect(state0).toEqual(initialState)
    })
    it('should update peer id', () => {
      const state0 = reducer(initialState, actions.refreshPeerIdSuccess(peerId))
      expect(state0.peerId.value).toEqual(peerId)
    })
    it('should track peer id error', () => {
      const state0 = reducer(initialState, actions.refreshPeerIdError(error))
      expect(state0.peerId.error).toEqual(error)
    })
  })
  describe('account seed', () => {
    it('should update account seed', () => {
      const state0 = reducer(
        initialState,
        actions.refreshAccountSeed.success(accountSeed)
      )
      expect(state0.accountSeed.value).toEqual(accountSeed)
    })
  })
  describe('avatar', () => {
    it('should not change state for request', () => {
      const state0 = reducer(
        initialState,
        actions.setAvatar.request({} as SharedImage)
      )
      expect(state0).toEqual(initialState)
    })
    it('should track avatar error', () => {
      const state0 = reducer(initialState, actions.setAvatar.failure(error))
      expect(state0.avatar.error).toEqual(error)
    })
  })
  describe('recovery phrase', () => {
    it('should track revocery phrase', () => {
      const state0 = reducer(
        initialState,
        actions.setRecoveryPhrase(recoveryPhrase)
      )
      expect(state0.recoveryPhrase).toEqual(recoveryPhrase)
    })
  })
})
