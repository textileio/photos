import actions, { reducer } from '../UIRedux'
import { SharedImage, ThreadId } from '../../Models/TextileTypes'
import { hash } from 'react-native-fs';

const initialState = reducer(undefined, {} as any)
const threadId = 'threadId' as ThreadId
const comment = 'comment'
const sharedImage: SharedImage = {
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
