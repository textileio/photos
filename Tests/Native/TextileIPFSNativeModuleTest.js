import IPFS from '../../TextileIPFSNativeModule'

describe('Testing TextileIPFSNativeModule wrapper', () => {

  it('expect createNodeWithDataDir to handle and (re)throw errors from go', async () => {
    expect.assertions(1)
    try {
      await IPFS.createNodeWithDataDir('./', 'reject', 'DEBUG')
    } catch (error) {
      // TODO: Inspect error object better? Really just mocked anyway...
      expect(error.name).toBe('Error')
    }
  })

  it('expect logIn to throw error before createNodeWithDataDir has been called', async () => {
    expect.assertions(1)
    try {
      await IPFS.signIn('username', 'password')
    } catch (error) {
      // TODO: Inspect error object better? Really just mocked anyway...
      expect(error.name).toBe('Error')
    }
  })

  it('expect createNodeWithDataDir to resolve to true', async () => {
    expect.assertions(1)
    const success = await IPFS.createNodeWithDataDir('./', 'resolve', 'DEBUG')
    expect(success).toBe(true)
  })

  it('expect startNode to resolve with true even with multiple calls', async () => {
    expect.assertions(2)
    const success1 = await IPFS.startNode()
    expect(success1).toBe(true)
    const success2 = await IPFS.startNode()
    expect(success2).toBe(true)
  })

  it('expect signUp to resolve with valid JSON string or error with bad creds', async () => {
    expect.assertions(2)
    const data = await IPFS.signUp('invalid', '', '', '')
    const response = JSON.parse(data)
    expect(response.error).toEqual(expect.anything())
    try {
      await IPFS.signUp('throw', '', '', '')
    } catch(error) {
      // TODO: Inspect error object better? Really just mocked anyway...
      expect(error.name).toBe('Error')
    }
  })

  it('expect signIn to resolve with error if not signed up', async () => {
    expect.assertions(2)
    const data = await IPFS.signIn('username', 'password')
    const response = JSON.parse(data)
    expect(response.error).toEqual(expect.anything())
    expect(response.status).toEqual(403)
  })

  it('expect signUp to resolve with a valid JSON string with good creds', async () => {
    expect.assertions(2)
    const data = await IPFS.signUp('username', '', '', '')
    const response = JSON.parse(data)
    expect(response.error).toEqual(undefined)
    expect(response.status).toEqual(201)
  })

  it('expect signIn to resolve with session token if signed up', async () => {
    expect.assertions(2)
    const data = await IPFS.signIn('username', 'password')
    const response = JSON.parse(data)
    expect(response.session).toEqual('session_token')
    expect(response.status).toEqual(200)
  })

  it('expect stopNode to resolve with true', async () => {
    expect.assertions(1)
    const success = await IPFS.stopNode()
    expect(success).toBe(true)
  })
})
