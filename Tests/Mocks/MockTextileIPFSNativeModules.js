const EventEmitter = require('EventEmitter')
const RCTDeviceEventEmitter = require('RCTDeviceEventEmitter')

// Mock the NativeEventEmitter as a normal JS EventEmitter.
export class mockNativeEventEmitter extends EventEmitter {
  constructor() {
    super(RCTDeviceEventEmitter.sharedSubscriber)
  }
}

export const mockTextileIPFS = {
  _isSignedIn: false,
  // If an api url with reject in it is used fail, else resolve true
  createNodeWithDataDir: jest.fn().mockImplementation((dataDir, apiUrl, logLevel) => {
    if (apiUrl.includes("reject")) {
      throw new Error('CREATE ERROR')
    } else {
      return Promise.resolve(true)
    }
  }),
  // Start successfully the 1st time called, and reject with error 2nd time
  startNode: jest.fn()
    .mockResolvedValueOnce(true)
    .mockRejectedValueOnce(new Error('START ERROR')),
  // Stop successfully the 1st time called, and reject with error 2nd time
  stopNode: jest.fn()
    .mockResolvedValueOnce(true)
    .mockRejectedValueOnce(new Error('STOP ERROR')),
  // If a password of 'invalid' is used, reject, else, resolve true
  signIn: jest.fn().mockImplementation((username, password) => {
    if (username === 'invalid') {
      return Promise.resolve('{"status": 403, "error": "forbidden"}')
    } else if (username == 'throw'){
      throw new Error('{"status": 404, "error": "not found"}')
    }
    this._isSignedIn = true
    return Promise.resolve('{"status": 200, "session": "session_token"}')
  }),
  signUpWithEmail: jest.fn().mockImplementation((username, password, email, referral) => {
    if (username === 'invalid') {
      return Promise.resolve('{"status": 404, "error": "something was invalid"}')
    } else if (username === 'throw') {
      throw new Error('{"status": 520, "error": "some random error"}')
    }
    this._isSignedIn = true
    return Promise.resolve('{"status": 201, "session": "session_token"}')
  }),
  // Just always return true
  isSignedIn: jest.fn().mockImplementation(() => this._isSignedIn),
  // TODO: Implement signOut (not currently used anyway)
  getUsername: jest.fn().mockImplementation(() => {
    if (this._isSignedIn) {
      return Promise.resolve('username')
    } else {
      // TODO: Use 'real' username error from go?
      throw new Error('USERNAME ERROR')
    }
  }),
  updateThread: jest.fn().mockImplementation((mnemonic, name) => {
    if (mnemonic === 'invalid') {
      throw new Error('THREAD JOIN ERROR')
    } else {
      return Promise.resolve(true)
    }
  }),
  getPhotos: jest.fn().mockImplementation((offset, limit, thread) => {
    if (thread === 'invalid') {
      throw new Error('GET PHOTOS ERROR')
    } else {
      const hashes = [
        'QmK1Zc...U9aFK7',
        'QmdT3L...47DZHQ',
        'Qmp7Qd...rshMvW',
        'Qmu5rm...rkPozN',
        'QmXqWK...6gpRL9'
      ]
      return Promise.resolve(hashes.slice(0, limit))
    }
  }),
  getHashData: jest.fn().mockImplementation(path => {
    if (path.includes('caption')) {
      return Promise.resolve(Buffer.from('some caption text').toString('base64'))
    } else if (path.includes('meta')) {
      return Promise.resolve(Buffer.from('{"meta": "data"}').toString('base64'))
    } else {
      // We only ever use this method to grab cap/meta, so just throw for tests
      throw new Error('GET DATA ERROR')
    }
  }),
  getHashRequest: jest.fn().mockImplementation(path => {
    if (path.includes('invalid')) {
      throw new Error('TOKEN ERROR')
    } else {
      return Promise.resolve({
        host: 'localhost',
        protocol: 'https',
        token: 'access_token'
      })
    }
  }),
  pairNewDevice : jest.fn().mockImplementation(pkb64 => {
    if (pubKey.includes('invalid')) {
      throw new Error('PAIR DEVICE ERROR')
    } else {
      return Promise.resolve('test topic')
    }
  }),
  // NOTE: Only for Android
  getRealPathFromURI: jest.fn().mockImplementation(uriString => {
    if (uriString.includes('invalid')) {
      throw new Error('URI ERROR')
    } else {
      return Promise.resolve('file://path/to/file.jpg')
    }
  })
}

export default { mockNativeEventEmitter, mockTextileIPFS }
