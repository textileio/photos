import actions, { reducer, NotificationsState } from '../NotificationsRedux'
import { FilesAddedNotification } from '../../Models/Notifications'
import { pb } from '@textile/react-native-sdk'

const initialState = reducer(undefined, {} as any)

// const notification1: FilesAddedNotification = {
//   actor: 'PeerId',
//   block: 'BlockId',
//   body: 'some photo',
//   date: new Date(),
//   id: 'NotificationId1',
//   read: false,
//   type: pb.Notification.Type.FILES_ADDED,
//   threadId: 'threadId1',
//   threadName: 'threadName1',
//   target: 'hash',
//   username: 'username',
//   avatar: 'avatar'
// }

// const notification2: FilesAddedNotification = {
//   actor: 'PeerId',
//   block: 'BlockId',
//   body: 'some photo',
//   date: new Date(),
//   id: 'NotificationId2',
//   read: false,
//   type: pb.Notification.Type.FILES_ADDED,
//   threadId: 'threadId2',
//   threadName: 'threadName2',
//   target: 'hash2',
//   username: 'username',
//   avatar: 'avatar'
// }

describe('notifications stories', () => {
  it('should run a dumy test for now', () => {
    expect(true).toBeTruthy()
  })
//   describe('initial state', () => {
//     it('should match snapshot', () => {
//       expect(initialState).toMatchSnapshot()
//     })
//   })
//   describe('refreshing notifications', () => {
//     let state0 = reducer(initialState, actions.refreshNotificationsStart())
//     it('should start refresh of notifications', () => {
//       const match0: NotificationsState = {refreshing: true, notifications: []}
//       expect(state0).toMatchObject(match0)
//     })
//     it('should add notifications', () => {
//       state0 = reducer(state0, actions.refreshNotificationsSuccess([notification1]))
//       const match1: NotificationsState = {refreshing: false, notifications: [notification1]}
//       expect(state0).toMatchObject(match1)
//     })
//     it('should add single notifications', () => {
//       expect(state0.notifications.length).toEqual(1)
//       const state2 = reducer(state0, actions.newNotificationRequest(notification2))
//       expect(state2.notifications.length).toEqual(2)
//       expect(state2.notifications[0]).toMatchObject(notification2)
//     })
//   })
})
