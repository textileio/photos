import {
    ExternalInvite,
    File,
    ThreadInfo,
    ThreadType,
    ThreadState,
    BlockInfo,
    BlockType
} from '../../App/NativeModules/Textile/Model'

export default {
    acceptExternalThreadInvite: jest.fn((id, key): Promise<string> => new Promise((resolve) => {
        resolve('SUCCESS')
    })),
    acceptThreadInviteViaNotification: jest.fn((id): Promise<string> => new Promise((resolve) => {
        resolve('SUCCESS')
    })),
    addExternalThreadInvite: jest.fn((id): Promise<string> => new Promise((resolve) => {
        const mockInvite: ExternalInvite = {
            id,
            key: 'VsHHHz8bC8fu9k78RaX8ujQsUzGzaUxwKJyLFKKDacUZoWJaouGnzUQwgmh5',
            inviter: 'mock'
        }
        resolve(JSON.stringify(mockInvite))
    })),
    addSchema: jest.fn((): Promise<string> => new Promise((resolve) => {
        // TODO: handle jsonstr: string input better
        const mockFile: File = {
            mill: 'ABC',
            checksum: 'DEF',
            source: 'GHI',
            hash: 'JKL',
            media: 'photo',
            size: 123,
            added: 'ABC',
            meta: { height: 1 }
          }
        resolve(JSON.stringify(mockFile))
    })),
    addThread: jest.fn((key: string, name: string): Promise<string> => new Promise((resolve) => {
        const mockThreadInfo: ThreadInfo = {
            id: 'ABC',
            key,
            name,
            initiator: 'andrew?',
            peer_cnt: 1,
            block_cnt: 1,
            file_cnt: 1,
            type: 'PUBLIC' as ThreadType,
            state: 'LOADED' as ThreadState
          }
        resolve(JSON.stringify(mockThreadInfo))
    })),
    addThreadFiles: jest.fn((base64: string, threadId: string, caption: string): Promise<string> => new Promise((resolve) => {
        const mockBlockInfo: BlockInfo = {
            id: 'ABC',
            thread_id: threadId,
            author_id: 'DEF',
            username: 'mock',
            type: 'FILES' as BlockType,
            date: '2018-12-11T18:48:36.393Z',
            parents: []
          }
        resolve(JSON.stringify(mockBlockInfo))
    })),
    stop: jest.fn((): Promise<void> => new Promise((resolve) => {
        resolve()
    })),
    start: jest.fn((): Promise<void> => new Promise((resolve) => {
        resolve()
    }))
}