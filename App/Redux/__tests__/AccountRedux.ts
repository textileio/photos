import actions, { reducer } from '../AccountRedux'

const initialState = reducer(undefined, {} as any)
const info = {
  address: 'address',
  peerId: 'peerId',
  profile: {
    address: 'address',
    inboxes: ['address1', 'address2'],
    username: 'username',
    avatar_uri: 'avatarUri'
  },
  seed: 'seed',
  username: 'username'
}
const error = 'error'
const avatarId = 'avatarId'
const recoveryPhrase = 'recoveryPhrase'

describe('account', () => {
  describe('initial state', () => {
    it('should match snapshot', () => {
      expect(initialState).toMatchSnapshot()
    })
  })
  describe('account info', () => {
    it('should not change state for request', () => {
      const state0 =  reducer(initialState, actions.refreshAccountInfoRequest())
      expect(state0).toEqual(initialState)
    })
    it('should update account info', () => {
      const { address, peerId, profile, seed, username } = info
      const state0 = reducer(initialState, actions.refreshAccountInfoSuccess(address, peerId, profile, seed, username))
      expect(state0.info).toEqual(info)
    })
    it('should track account info error', () => {
      const state0 = reducer(initialState, actions.refreshAccountInfoError(error))
      expect(state0.info.error).toEqual(error)
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
