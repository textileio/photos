import {
    enable,
    toPayload
} from '../Notifications'
// import { NotificationType } from '@textile/react-native-sdk'
import { Notification } from '../../Models/Notifications'
import { NotificationType } from '@textile/react-native-sdk'

describe('notifications', () => {
    describe('enable', () => {
        it('should fire notification lib successfully', async () => {
            await expect(enable()).resolves.toMatchSnapshot()
        })
    })
    describe('toPayload', () => {
        const base = {
            id: 'noteId',
            date: '2018-12-11T22:34:26.265Z',
            actor_id: 'EFG',
            read: false,
            username: 'mock test',
            threadId: 'ABC',
            threadName: 'Great Thread',
            target: 'DEF'
        }
        it('should create InviteReceivedNotification', () => {
            const notification = {
                ...base,
                body: 'invited you to join',
                type: 'INVITE_RECEIVED' as NotificationType
            }
            expect(toPayload(notification as Notification)).toMatchSnapshot()
        })
        it('should create AccountPeerJoinedNotification', () => {
            const notification = {
                ...base,
                body: 'joined',
                type: NotificationType.AccountPeerJoinedNotification
            }
            expect(toPayload(notification as Notification)).toMatchSnapshot()
        })
        it('should create PeerJoinedNotification', () => {
            const notification = {
                ...base,
                body: 'joined',
                type: NotificationType.PeerJoinedNotification
            }
            expect(toPayload(notification as Notification)).toMatchSnapshot()
        })
        it('should create PeerLeftNotification', () => {
            const notification = {
                ...base,
                body: 'left',
                type: NotificationType.PeerLeftNotification
            }
            expect(toPayload(notification as Notification)).toMatchSnapshot()
        })
        it('should create MessageAddedNotification', () => {
            const notification = {
                ...base,
                body: 'here is my message!',
                type: NotificationType.MessageAddedNotification
            }
            expect(toPayload(notification as Notification)).toMatchSnapshot()
        })
        it('should create FilesAddedNotification', () => {
            const notification = {
                ...base,
                body: 'added a photo',
                type: NotificationType.FilesAddedNotification
            }
            expect(toPayload(notification as Notification)).toMatchSnapshot()
        })
        it('should create CommentAddedNotification', () => {
            const notification = {
                ...base,
                body: 'commented on a photo: a camel!',
                type: NotificationType.CommentAddedNotification
            }
            expect(toPayload(notification as Notification)).toMatchSnapshot()
        })
        it('should create LikeAddedNotification', () => {
            const notification = {
                ...base,
                body: 'liked a photo',
                type: NotificationType.LikeAddedNotification
            }
            expect(toPayload(notification as Notification)).toMatchSnapshot()
        })
    })
})
