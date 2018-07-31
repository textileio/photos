import actions, { reducer } from '../UIRedux'

const initialState = reducer(undefined, {} as any)

const threadId = 'threadId'

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
    it('should be have an active hash', () => {
      const state = reducer(initialState, actions.authorPhotoShareRequest('someHash'))
      expect(state.sharingPhoto.active).toEqual(true)
      expect(state.sharingPhoto.hash).toEqual('someHash')
    })
    it('should update selected threads', () => {
      const state = reducer(initialState, actions.authorPhotoShareRequest('someHash'))
      expect(state.sharingPhoto.selectedThreads.size).toEqual(0)
      const state1 = reducer(state, actions.updateSelectedThreads(new Map([['thread', true]])))
      expect(state1.sharingPhoto.selectedThreads.size).toEqual(1)
      expect(state1.sharingPhoto.selectedThreads.get('thread')).toEqual(true)
    })
    it('should update comment', () => {
      const state = reducer(initialState, actions.authorPhotoShareRequest('someHash'))
      expect(state.sharingPhoto.comment).toBeUndefined
      const state1 = reducer(state, actions.updateComment('a comment'))
      expect(state1.sharingPhoto.comment).toEqual('a comment')
    })
    it('should cancel sharing', () => {
      const state = reducer(initialState, actions.authorPhotoShareRequest('someHash'))
      expect(state.sharingPhoto.active).toEqual(true)
      const state1 = reducer(state, actions.cancelAuthoringPhotoShare())
      expect(state1.sharingPhoto.active).toEqual(false)
    })
    it('sharePhotoRequest should not update state', () => {
      const state = reducer(initialState, actions.sharePhotoRequest(threadId, ['anotherThread'], 'caption'))
      expect(state).toEqual(initialState)
    })
    it('imageSharingError should not update state', () => {
      const state = reducer(initialState, actions.imageSharingError(new Error()))
      expect(state).toEqual(initialState)
    })
  })
})
