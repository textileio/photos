import actions, { reducer } from '../AccountRedux'
import { Profile } from '@textile/react-native-sdk'

const initialState = reducer(undefined, {} as any)
const profile: Profile = {
  address: 'address',
  inboxes: ['address1', 'address2'],
  username: 'username',
  avatar_uri: 'avatarUri'
}
const peerId = 'peerId'
const error = 'error'
const avatarId = 'avatarId'
const recoveryPhrase = 'recoveryPhrase'

describe('account', () => {
  describe('initial state', () => {
    it('should match snapshot', () => {
      expect(initialState).toMatchSnapshot()
    })
  })
  describe('profile', () => {
    it('should be processing from refresh', () => {
      const state0 =  reducer(initialState, actions.refreshProfileRequest())
      expect(state0.profile.processing).toBeTruthy()
    })
    it('should be processing from setUsername', () => {
      const state0 =  reducer(initialState, actions.setUsernameRequest('username'))
      expect(state0.profile.processing).toBeTruthy()
    })
    it('should update profile', () => {
      const state0 = reducer(initialState, actions.refreshProfileSuccess(profile))
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
      const state0 =  reducer(initialState, actions.refreshPeerIdRequest())
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
  describe('avatar', () => {
    it('should not change state for request', () => {
      const state0 = reducer(initialState, actions.setAvatarRequest('avatarId'))
      expect(state0).toEqual(initialState)
    })
    it('should track avatar error', () => {
      const state0 = reducer(initialState, actions.setAvatarError(error))
      expect(state0.avatar.error).toEqual(error)
    })
    it('should track pending avatar id', () => {
      const state0 = reducer(initialState, actions.setPendingAvatar(avatarId))
      expect(state0.avatar.pendingId).toEqual(avatarId)
    })
  })
  describe('recovery phrase', () => {
    it('should track revocery phrase', () => {
      const state0 = reducer(initialState, actions.setRecoveryPhrase(recoveryPhrase))
      expect(state0.recoveryPhrase).toEqual(recoveryPhrase)
    })
  })
})
