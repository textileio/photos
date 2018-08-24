import actions, { reducer } from '../CameraRollRedux'

const initialState = reducer(undefined, {} as any)
const ids = ['id1', 'id2']
const nonId = 'nonId'

describe('queried photos stories', () => {
  describe('initial state', () => {
    it('should match snapshot', () => {
      expect(initialState).toMatchSnapshot()
    })
  })
  describe('tracking photos', () => {
    it('should initialize photos', () => {
      expect(initialState.initialized).toBeFalsy()
      const state0 = reducer(initialState, actions.initialzePhotos(ids))
      expect(state0.initialized).toBeTruthy()
      expect(state0.queriedPhotos[ids[0]]).toBeTruthy()
      expect(state0.queriedPhotos[ids[1]]).toBeTruthy()
    })
    it('should track a photo', () => {
      const state0 = reducer(initialState, actions.trackPhoto(ids[0]))
      expect(state0.queriedPhotos[ids[0]]).toBeTruthy()
      expect(state0.queriedPhotos[nonId]).toBeFalsy()
    })
    it('should track many photos', () => {
      const state0 = reducer(initialState, actions.trackPhotos(ids))
      expect(state0.queriedPhotos[ids[0]]).toBeTruthy()
      expect(state0.queriedPhotos[ids[1]]).toBeTruthy()
      expect(state0.queriedPhotos[nonId]).toBeFalsy()
    })
  })
  describe('untracking photos', () => {
    it('should untrack a photo', () => {
      const state0 = reducer(initialState, actions.trackPhotos(ids))
      expect(state0.queriedPhotos[ids[0]]).toBeTruthy()
      expect(state0.queriedPhotos[ids[1]]).toBeTruthy()
      const state1 = reducer(state0, actions.untrackPhoto(ids[0]))
      expect(state1.queriedPhotos[ids[1]]).toBeTruthy()
      expect(state1.queriedPhotos[ids[0]]).toBeFalsy()
    })
    it('should untrack photos', () => {
      const state0 = reducer(initialState, actions.trackPhotos(ids))
      expect(state0.queriedPhotos[ids[0]]).toBeTruthy()
      expect(state0.queriedPhotos[ids[1]]).toBeTruthy()
      const state1 = reducer(state0, actions.untrackPhotos(ids))
      expect(state1.queriedPhotos[ids[1]]).toBeFalsy()
      expect(state1.queriedPhotos[ids[0]]).toBeFalsy()
    })
  })
})
