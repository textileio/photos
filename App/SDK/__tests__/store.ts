import AsyncStorage from '../__mocks__/AsyncStorage'
import TextileStore from '../store'
import { NodeState, StoredNodeState } from '../types'

const store = new TextileStore()

const storedNodeState: StoredNodeState = {
  state: NodeState.nonexistent
}

jest.mock('react-native', () => {
  return {
      AsyncStorage
  }
})

describe('rn store', () => {
  describe('defaults', () => {
    it('serialize in and out to same', async () => {
      const serializedNodeState = store.serialize(storedNodeState) as string
      await expect(JSON.parse(serializedNodeState) as StoredNodeState).toEqual(storedNodeState)
    })

    it('empty state', async () => {
      await expect(store.getAppState()).resolves.toMatchSnapshot()
      await expect(store.getNodeOnline()).resolves.toMatchSnapshot()
      await expect(store.getNodeState()).resolves.toMatchSnapshot()
    })
  })
  describe('type returns', () => {
    it('appState', async () => {
      await store.setAppState('active')
      const storedValue = await store.getAppState()
      const storedType = typeof storedValue
      await expect(storedType).toMatchSnapshot()
      await expect(storedValue).toMatchSnapshot()
    })
    it('nodeOnline', async () => {
      await store.setNodeOnline(true)
      const storedValue = await store.getNodeOnline()
      const storedType = typeof storedValue
      await expect(storedType).toMatchSnapshot()
      await expect(storedValue).toMatchSnapshot()
    })
    it('nodeOnline', async () => {
      const newState = { state: NodeState.creating }
      await store.setNodeState(newState)
      const storedValue = await store.getNodeState()
      const storedType = typeof storedValue
      await expect(storedType).toMatchSnapshot()
      await expect(storedValue).toMatchSnapshot()
    })
  })
})
