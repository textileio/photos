import actions, { reducer } from '../GroupsRedux'
import { IFiles, Thread } from '@textile/react-native-sdk'

const initialState = reducer(undefined, {} as any)

const threadId = 'threadId'
const threadKey = 'threadKey'
const threadName = 'threadName'
const threadInitiator = 'username'
const threadType = 2
const threadSharing = 0
const threadWhitelist: ReadonlyArray<string> = []
const thread = {
  id: threadId,
  key: threadKey,
  name: threadName,
  type: threadType,
  initiator: threadInitiator,
  sharing: threadSharing,
  whitelist: threadWhitelist,
  valid: true
}
const photos: IFiles[] = [
  {
    user: {
      name: 'username',
      address: 'address',
      avatar: 'avatar'
    },
    caption: '',
    block: 'block_id',
    target: 'target',
    data: 'data',
    date: { seconds: 10, nanos: 20 },
    files: [],
    comments: [],
    likes: [],
    threads: []
  }
]

describe('photo viewing stories', () => {
  describe('initial state', () => {
    it('should match snapshot', () => {
      expect(initialState).toMatchSnapshot()
    })
  })
  describe('refresh thread', () => {
    it('should refresh', () => {
      const state0 = reducer(initialState, actions.insertThread(thread))
      expect(state0.threads[threadId]).toBeDefined()
      const state1 = reducer(state0, actions.refreshThreadRequest(threadId))
      expect(state1.threads[threadId]).toBeDefined()
      expect(state1.threads[threadId]!.querying).toBeTruthy()
      expect(state1.threads[threadId]!.size).toEqual(0)
      const state2 = reducer(
        state1,
        actions.refreshThreadSuccess(threadId, photos)
      )
      expect(state2.threads[threadId]!.size).toEqual(1)
    })
  })
})
