import {
    enable,
    toPayload
} from '../Notifications'
import { Notification } from '../../Models/Notifications'
import { Notification as SdkNotification } from '@textile/react-native-sdk'

describe('notifications', () => {
    describe('enable', () => {
        it('should fire notification lib successfully', async () => {
            await expect(enable()).resolves.toMatchSnapshot()
        })
    })
    describe('toPayload', () => {
        const base = {
            id: 'noteId',
            date: new Date(),
            actor: 'EFG',
            block: 'block',
            read: false,
            username: 'mock test',
            avatar: 'avatar',
            threadId: 'ABC',
            threadName: 'Great Thread',
            target: 'DEF'
        }
        // it('should create InviteReceivedNotification', () => {
        //     const notification = {
        //         ...base,
        //         body: 'invited you to join',
        //         type: SdkNotification.Type.INVITE_RECEIVED
        //     }
        //     expect(toPayload(notification as Notification)).toMatchSnapshot()
        // })
        // it('should create AccountPeerJoinedNotification', () => {
        //     const notification = {
        //         ...base,
        //         body: 'joined',
        //         type: SdkNotification.Type.ACCOUNT_PEER_JOINED
        //     }
        //     expect(toPayload(notification as Notification)).toMatchSnapshot()
        // })
        // it('should create PeerJoinedNotification', () => {
        //     const notification = {
        //         ...base,
        //         body: 'joined',
        //         type: SdkNotification.Type.PEER_JOINED
        //     }
        //     expect(toPayload(notification as Notification)).toMatchSnapshot()
        // })
        // it('should create PeerLeftNotification', () => {
        //     const notification = {
        //         ...base,
        //         body: 'left',
        //         type: SdkNotification.Type.PEER_LEFT
        //     }
        //     expect(toPayload(notification as Notification)).toMatchSnapshot()
        // })
        // it('should create MessageAddedNotification', () => {
        //     const notification = {
        //         ...base,
        //         body: 'here is my message!',
        //         type: SdkNotification.Type.MESSAGE_ADDED
        //     }
        //     expect(toPayload(notification as Notification)).toMatchSnapshot()
        // })
        // it('should create FilesAddedNotification', () => {
        //     const notification = {
        //         ...base,
        //         body: 'added a photo',
        //         type: SdkNotification.Type.FILES_ADDED
        //     }
        //     expect(toPayload(notification as Notification)).toMatchSnapshot()
        // })
        // it('should create CommentAddedNotification', () => {
        //     const notification = {
        //         ...base,
        //         body: 'commented on a photo: a camel!',
        //         type: SdkNotification.Type.COMMENT_ADDED
        //     }
        //     expect(toPayload(notification as Notification)).toMatchSnapshot()
        // })
        // it('should create LikeAddedNotification', () => {
        //     const notification = {
        //         ...base,
        //         body: 'liked a photo',
        //         type: SdkNotification.Type.LIKE_ADDED
        //     }
        //     expect(toPayload(notification as Notification)).toMatchSnapshot()
        // })
    })
})
