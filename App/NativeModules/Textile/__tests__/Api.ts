import {
    acceptExternalThreadInvite,
    acceptThreadInviteViaNotification,
    addExternalThreadInvite,
    addSchema,
    addThread,
    addThreadFiles
} from '../Api'
import { IDirectory } from '@textile/react-native-protobufs'

const threadId = 'QmdNgTtH468cqZFzXCi4sVSWTbJMWQbhYb8cBVyikP9LzW'
const threadKey = 'VsHHHz8bC8fu9k78RaX8ujQsUzGzaUxwKJyLFKKDacUZoWJaouGnzUQwgmh5'
const threadName = 'Great Name'
const shared = true

describe('textile api', () => {
    describe('thread invites', () => {
        it('accept external thread invite', async () => {
            const result = await acceptExternalThreadInvite(threadId, threadKey)
            expect(result).toEqual('SUCCESS')
        })
        it('add thread invite via notification', async () => {
            const result = await acceptThreadInviteViaNotification(threadId)
            expect(result).toEqual('SUCCESS')
        })
        it('add external thread invite', async () => {
            const result = await addExternalThreadInvite(threadId)
            expect(typeof result).toEqual('object')
            expect(result).toHaveProperty('id')
            expect(result.id).toEqual(threadId)
        })
    })
    describe('threads', () => {
        it('addSchema', async () => {
            const result = await addSchema('{}')
            expect(typeof result).toEqual('object')
            expect(result).toHaveProperty('mill')
        })
        it('addThread', async () => {
            const result = await addThread(threadKey, threadName, shared)
            expect(typeof result).toEqual('object')
            expect(result).toHaveProperty('key')
            expect(result.key).toEqual(threadKey)
            expect(result).toHaveProperty('name')
            expect(result.name).toEqual(threadName)
        })
        it('addThreadFiles', async () => {
            const dir: IDirectory = {}
            const result = await addThreadFiles(dir, threadId, 'here we go')
            expect(typeof result).toEqual('object')
            expect(result).toHaveProperty('thread_id')
            expect(result.thread_id).toEqual(threadId)
        })
    })
})
