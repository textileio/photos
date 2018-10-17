import actions, { reducer } from '../PhotoViewingRedux'
import { ThreadId, ThreadName, Photo, PhotoId, BlockId, PeerId } from '../../Models/TextileTypes'

const initialState = reducer(undefined, {} as any)

const threadId: ThreadId = 'threadId' as any
const threadName: ThreadName = 'threadName' as any
const photos: Photo[] = [
  { id: 'id' as any, author_id: 'author_id' as any, block_id: 'block_id' as any, date: 'now', comments: [], likes: [] }
]

describe('photo viewing stories', () => {
  describe('initial state', () => {
    it('should match snapshot', () => {
      expect(initialState).toMatchSnapshot()
    })
  })
  describe('refresh thread', () => {
    it('should refresh', () => {
      const state0 = reducer(initialState, actions.insertThread(threadId, threadName))
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
