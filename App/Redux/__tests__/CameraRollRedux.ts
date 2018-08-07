import actions, { reducer } from '../CameraRollRedux'
import {AddResult, FileArchive, SharedImage} from '../../Models/TextileTypes'

const initialState = reducer(undefined, {} as any)
const ids = ['id1', 'id2']
const nonId = 'nonId'
const pickerImage: SharedImage = {
  origURL: 'https://texilte.photos/image.jpg',
  uri: 'https://texilte.photos/image.jpg',
  height: 400,
  width: 400,
  isVertical: true
}
const caption = 'My comment'
const addResult: AddResult = {
  id: 'ABC',
  key: 'XYZ'
}

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
  describe('handle photo picker', () => {
    it('should track a photo', () => {
      const state0 = reducer(initialState, actions.imagePickerSuccess(ids[0], pickerImage))
      expect(state0.pendingShares[ids[0]]).toBeTruthy()
      expect(state0.pendingShares[nonId]).toBeFalsy()
      expect(state0.pendingShares[ids[0]].length === 1).toBeTruthy()
    })
    it('should add caption a photo', () => {
      const state0 = reducer(initialState, actions.imagePickerSuccess(ids[0], pickerImage))
      const state1 = reducer(state0, actions.addComment(ids[0], pickerImage, caption))
      expect(state1.pendingShares[ids[0]][0].caption === caption).toBeTruthy()
    })
    it('should fail and remove the photo record', () => {
      const state0 = reducer(initialState, actions.imagePickerSuccess(ids[0], pickerImage))
      const state1 = reducer(state0, actions.addComment(ids[0], pickerImage, caption))
      const state2 = reducer(state1, actions.imagePinError(ids[0], pickerImage))
      expect(state2.pendingShares[ids[0]]).toBeFalsy()
    })
    it('should succeed pinning a photo', () => {
      const state0 = reducer(initialState, actions.imagePickerSuccess(ids[0], pickerImage))
      const state1 = reducer(state0, actions.addComment(ids[0], pickerImage, caption))
      const state2 = reducer(state1, actions.localPinSuccess(ids[0], pickerImage, addResult))
      expect(state2.pendingShares[ids[0]][0].addResult === addResult).toBeTruthy()
    })
    it('should successfully cancel a photo', () => {
      const state0 = reducer(initialState, actions.imagePickerSuccess(ids[0], pickerImage))
      const state1 = reducer(state0, actions.addComment(ids[0], pickerImage, caption))
      const state2 = reducer(state1, actions.localPinSuccess(ids[0], pickerImage, addResult))
      const state3 = reducer(state2, actions.cancelShare(ids[0], pickerImage))
      expect(state3.pendingShares[ids[0]]).toBeFalsy()
    })
    it('should successfully upload a photo', () => {
      const state0 = reducer(initialState, actions.imagePickerSuccess(ids[0], pickerImage))
      const state1 = reducer(state0, actions.addComment(ids[0], pickerImage, caption))
      const state2 = reducer(state1, actions.localPinSuccess(ids[0], pickerImage, addResult))
      expect(state2.pendingShares[ids[0]]).toBeTruthy()
      const state3 = reducer(state2, actions.remotePinSuccess(ids[0], pickerImage))
      expect(state3.pendingShares[ids[0]]).toBeFalsy()
    })
  })
})
