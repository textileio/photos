import actions, { reducer } from '../PhotoViewingRedux'
import { pb } from '@textile/react-native-sdk'

const initialState = reducer(undefined, {} as any)

const threadId = 'threadId'
const threadKey = 'threadKey'
const threadName = 'threadName'
const photos: pb.IFiles[] = [{
  user: {
    name: 'username',
    address: 'address',
    avatar: 'avatar'
  },
  caption: '',
  block: 'block_id',
  target: 'target',
  date: { seconds: 10, nanos: 20 },
  files: [],
  comments: [],
  likes: [],
  threads: []
}]

describe('photo viewing stories', () => {
  describe('initial state', () => {
    it('should match snapshot', () => {
      expect(initialState).toMatchSnapshot()
    })
  })
  describe('refresh thread', () => {
    it('should refresh', () => {
      const state0 = reducer(initialState, actions.insertThread(threadId, threadKey, threadName))
      expect(state0.threads[threadId]).toBeDefined()
      const state1 = reducer(state0, actions.refreshThreadRequest(threadId))
      expect(state1.threads[threadId]).toBeDefined()
      expect(state1.threads[threadId]!.querying).toBeTruthy()
      expect(state1.threads[threadId]!.photos.length).toEqual(0)
      const state2 = reducer(state1, actions.refreshThreadSuccess(threadId, photos))
      expect(state2.threads[threadId]!.photos.length).toEqual(1)
    })
  })
})
