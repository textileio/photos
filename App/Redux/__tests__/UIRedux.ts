import actions, { reducer } from '../UIRedux'

const initialState = reducer(undefined, {} as any)

describe('ui stories', () => {
  describe('initial state', () => {
    it('should match snapshot', () => {
      expect(initialState).toMatchSnapshot()
    })
  })
  describe('viewing photos', () => {
    it('should have an active thread', () => {
      const state = reducer(initialState, actions.viewPhotoRequest(0, 'myThread'))
      expect(state.viewingPhoto.active).toEqual(true)
      expect(state.viewingPhoto.index).toEqual(0)
      expect(state.viewingPhoto.thread).toEqual('myThread')
    })
    it('should switch photos', () => {
      const state = reducer(initialState, actions.viewPhotoRequest(0, 'myThread'))
      expect(state.viewingPhoto.index).toEqual(0)
      const state1 = reducer(state, actions.switchViewdPhoto(1))
      expect(state1.viewingPhoto.index).toEqual(1)
    })
    it('should dismiss viewed photo', () => {
      const state = reducer(initialState, actions.viewPhotoRequest(0, 'myThread'))
      expect(state.viewingPhoto.active).toEqual(true)
      const state1 = reducer(state, actions.dismissViewedPhoto())
      expect(state1.viewingPhoto.active).toEqual(false)
    })
  })
  describe('sharing a photo', () => {
    it('should be have an active hash', () => {
      const state = reducer(initialState, actions.authorPhotoShareRequest('someHash'))
      expect(state.sharingPhoto.active).toEqual(true)
      expect(state.sharingPhoto.hash).toEqual('someHash')
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
  })
})