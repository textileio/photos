import {
    acceptExternalThreadInvite,
    acceptThreadInviteViaNotification,
    addExternalThreadInvite
} from '../Api'
import {
    ExternalInvite
} from '../Model'

const threadId = 'QmdNgTtH468cqZFzXCi4sVSWTbJMWQbhYb8cBVyikP9LzW'
const threadKey = 'VsHHHz8bC8fu9k78RaX8ujQsUzGzaUxwKJyLFKKDacUZoWJaouGnzUQwgmh5'

jest.mock('NativeModules', () => {
    return {
        TextileNode: {
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
            }))
        }
    }
})

describe('textile api', () => {
    describe('thread invites', () => {
        it('acceptExternalThreadInvite', async () => {
            const result = await acceptExternalThreadInvite(threadId, threadKey)
            expect(result).toEqual('SUCCESS')
        })
        it('acceptThreadInviteViaNotification', async () => {
            const result = await acceptThreadInviteViaNotification(threadId)
            expect(result).toEqual('SUCCESS')
        })
        it('addExternalThreadInvite', async () => {
            const result = await addExternalThreadInvite(threadId)
            expect(typeof result).toEqual('object')
            expect(result).toHaveProperty('id')
            expect(result.id).toEqual(threadId)
        })
    })
})
