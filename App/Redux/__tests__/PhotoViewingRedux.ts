import actions, { reducer } from '../PhotoViewingRedux'
import { ThreadFilesInfo } from '@textile/react-native-sdk'

const initialState = reducer(undefined, {} as any)

const threadId = 'threadId'
const threadKey = 'threadKey'
const threadName = 'threadName'
const photos: ThreadFilesInfo[] = [{
  block: 'block_id',
  target: 'target',
  date: 'now',
  author_id: 'author_id',
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
