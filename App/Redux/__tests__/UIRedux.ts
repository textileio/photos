import actions, { reducer } from '../UIRedux'
import * as TT from '../../Models/TextileTypes'
import { hash } from 'react-native-fs';

const initialState = reducer(undefined, {} as any)
const threadId = 'threadId' as TT.ThreadId
const comment = 'comment'
const sharedImage: TT.SharedImage = {
  origURL: 'origURL',
  uri: 'uri',
  path: '/here',
  canDelete: false,
  height: 20,
  isVertical: true,
  width: 20
}

const sharedHash = 'hash'

describe('ui stories', () => {
  describe('initial state', () => {
    it('should match snapshot', () => {
      expect(initialState).toMatchSnapshot()
    })
  })
  // describe('viewing photos', () => {
  //   it('should have an active thread', () => {
  //     const state = reducer(initialState, actions.viewPhotoRequest(0, threadId))
  //     expect(state.viewingPhoto.active).toEqual(true)
  //     expect(state.viewingPhoto.index).toEqual(0)
  //     expect(state.viewingPhoto.threadId).toEqual(threadId)
  //   })
  //   it('should switch photos', () => {
  //     const state = reducer(initialState, actions.viewPhotoRequest(0, threadId))
  //     expect(state.viewingPhoto.index).toEqual(0)
  //     const state1 = reducer(state, actions.switchViewdPhoto(1))
  //     expect(state1.viewingPhoto.index).toEqual(1)
  //   })
  //   it('should dismiss viewed photo', () => {
  //     const state = reducer(initialState, actions.viewPhotoRequest(0, threadId))
  //     expect(state.viewingPhoto.active).toEqual(true)
  //     const state1 = reducer(state, actions.dismissViewedPhoto())
  //     expect(state1.viewingPhoto.active).toEqual(false)
  //   })
  // })
  describe('sharing a photo', () => {
    it('should update sharing photo via SharedPhoto', () => {
      const state = reducer(initialState, actions.updateSharingPhotoImage(sharedImage))
      expect(state.sharingPhoto!.image).toMatchObject(sharedImage)
    })
    it('should update sharing photo via photo hash', () => {
      const state = reducer(initialState, actions.updateSharingPhotoImage(sharedHash))
      expect(state.sharingPhoto!.image).toEqual(sharedHash)
    })
    it('should update sharing thread', () => {
      const state = reducer(initialState, actions.updateSharingPhotoThread(threadId))
      expect(state.sharingPhoto!.threadId).toEqual(threadId)
    })
    it('should update sharing comment', () => {
      const state = reducer(initialState, actions.updateSharingPhotoComment(comment))
      expect(state.sharingPhoto!.comment).toEqual(comment)
    })
    it('should cancel sharing', () => {
      const state = reducer(initialState, actions.updateSharingPhotoImage(sharedHash))
      expect(state.sharingPhoto).toBeDefined()
      const state1 = reducer(state, actions.cancelSharingPhoto())
      expect(state1.sharingPhoto).toBeUndefined()
    })
    it('sharePhotoRequest should clear sharing state', () => {
      const state0 = reducer(initialState, actions.updateSharingPhotoImage(sharedHash))
      expect(state0.sharingPhoto).toBeDefined()
      const state1 = reducer(initialState, actions.sharePhotoRequest())
      expect(state1.sharingPhoto).toBeUndefined()
    })
    it('imageSharingError should not update state', () => {
      const state = reducer(initialState, actions.imageSharingError(new Error()))
      expect(state).toEqual(initialState)
    })
  })
})
