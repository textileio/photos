import actions, { reducer } from '../UIRedux'
import { SharedImage } from '../../features/group/add-photo/models'
import { pb } from '@textile/react-native-sdk'

const initialState = reducer(undefined, {} as any)
const threadId: string = 'threadId' as any
const comment = 'comment'
const sharedImage: SharedImage = {
  isAvatar: false,
  origURL: 'origURL',
  uri: 'uri',
  path: '/here',
  canDelete: false
}

const sharedPhoto: pb.IFiles = {
  user: {
    name: 'user',
    address: 'address',
    avatar: 'avatar'
  },
  caption: '',
  block: 'b',
  comments: [],
  date: { seconds: 10, nanos: 20 },
  files: [],
  likes: [],
  target: 'd',
  threads: []
}

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
      const state = reducer(initialState, actions.updateSharingPhotoImage(sharedPhoto))
      expect(state.sharingPhoto!.image).toEqual(sharedPhoto)
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
      const state = reducer(initialState, actions.updateSharingPhotoImage(sharedPhoto))
      expect(state.sharingPhoto).toBeDefined()
      const state1 = reducer(state, actions.cancelSharingPhoto())
      expect(state1.sharingPhoto).toBeUndefined()
    })
    it('sharePhotoRequest should clear sharing state', () => {
      const state0 = reducer(initialState, actions.updateSharingPhotoImage(sharedPhoto))
      expect(state0.sharingPhoto).toBeDefined()
      const state1 = reducer(initialState, actions.sharePhotoRequest('imageId', 'threadId'))
      expect(state1.sharingPhoto).toBeUndefined()
    })
    it('imageSharingError should not update state', () => {
      const state = reducer(initialState, actions.imageSharingError(new Error()))
      expect(state).toEqual(initialState)
    })
  })
})
