import {
    enable,
    toPayload
} from '../Notifications'
import { Notification } from '../../Models/Notifications'
import { pb } from '@textile/react-native-sdk'

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
        //         type: pb.Notification.Type.INVITE_RECEIVED
        //     }
        //     expect(toPayload(notification as Notification)).toMatchSnapshot()
        // })
        // it('should create AccountPeerJoinedNotification', () => {
        //     const notification = {
        //         ...base,
        //         body: 'joined',
        //         type: pb.Notification.Type.ACCOUNT_PEER_JOINED
        //     }
        //     expect(toPayload(notification as Notification)).toMatchSnapshot()
        // })
        // it('should create PeerJoinedNotification', () => {
        //     const notification = {
        //         ...base,
        //         body: 'joined',
        //         type: pb.Notification.Type.PEER_JOINED
        //     }
        //     expect(toPayload(notification as Notification)).toMatchSnapshot()
        // })
        // it('should create PeerLeftNotification', () => {
        //     const notification = {
        //         ...base,
        //         body: 'left',
        //         type: pb.Notification.Type.PEER_LEFT
        //     }
        //     expect(toPayload(notification as Notification)).toMatchSnapshot()
        // })
        // it('should create MessageAddedNotification', () => {
        //     const notification = {
        //         ...base,
        //         body: 'here is my message!',
        //         type: pb.Notification.Type.MESSAGE_ADDED
        //     }
        //     expect(toPayload(notification as Notification)).toMatchSnapshot()
        // })
        // it('should create FilesAddedNotification', () => {
        //     const notification = {
        //         ...base,
        //         body: 'added a photo',
        //         type: pb.Notification.Type.FILES_ADDED
        //     }
        //     expect(toPayload(notification as Notification)).toMatchSnapshot()
        // })
        // it('should create CommentAddedNotification', () => {
        //     const notification = {
        //         ...base,
        //         body: 'commented on a photo: a camel!',
        //         type: pb.Notification.Type.COMMENT_ADDED
        //     }
        //     expect(toPayload(notification as Notification)).toMatchSnapshot()
        // })
        // it('should create LikeAddedNotification', () => {
        //     const notification = {
        //         ...base,
        //         body: 'liked a photo',
        //         type: pb.Notification.Type.LIKE_ADDED
        //     }
        //     expect(toPayload(notification as Notification)).toMatchSnapshot()
        // })
    })
})
