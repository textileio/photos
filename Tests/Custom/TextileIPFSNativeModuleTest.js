import IPFS from '../../TextileIPFSNativeModule'

describe('Testing TextileIPFSNativeModule wrapper', () => {
  it('expect createNodeWithDataDir to resolve to true', async () => {
    expect.assertions(1)
    const success = await IPFS.createNodeWithDataDir('./', 'https://fake.io', 'DEBUG')
    return expect(success).toBe(true)
  })
})
