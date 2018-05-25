import IPFS from '../../TextileIPFSNativeModule'

describe('Testing TextileIPFSNativeModule wrapper', () => {
  it('expect createNodeWithDataDir to resolve to true', async () => {
    expect.assertions(1)
    const success = await IPFS.createNodeWithDataDir('./', 'resolve', 'DEBUG')
    expect(success).toBe(true)
  })

  it('expect createNodeWithDataDir to throw error', async () => {
    expect.assertions(1)
    try {
      await IPFS.createNodeWithDataDir('./', 'reject', 'DEBUG')
    } catch (error) {
      // TODO: Inspect error object better? Really just mocked anyway...
      expect(error.name).toBe('Error')
    }
  })

  it('expect startNode to resolve with true and then reject with error', async () => {
    expect.assertions(2)
    const success = await IPFS.startNode()
    expect(success).toBe(true)
    try {
      await IPFS.startNode()
    } catch (error) {
      // TODO: Inspect error object better? Really just mocked anyway...
      expect(error.name).toBe('Error')
    }
  })

  it('expect stopNode to resolve with true and then reject with error', async () => {
    expect.assertions(2)
    const success = await IPFS.stopNode()
    expect(success).toBe(true)
    try {
      await IPFS.stopNode()
    } catch (error) {
      // TODO: Inspect error object better? Really just mocked anyway...
      expect(error.name).toBe('Error')
    }
  })
})
