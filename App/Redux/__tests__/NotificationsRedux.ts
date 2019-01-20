import actions, { reducer, NotificationsState } from '../NotificationsRedux'
import { FilesAddedNotification } from '../../Models/Notifications'
import { NotificationType } from '@textile/react-native-sdk'

const initialState = reducer(undefined, {} as any)

const notification1: FilesAddedNotification = {
  actor_id: 'PeerId',
  block_id: 'BlockId',
  body: 'some photo',
  date: '1999-01-01T00:00:00Z',
  id: 'NotificationId1',
  read: false,
  type: NotificationType.FilesAddedNotification,
  threadId: 'threadId1',
  threadName: 'threadName1',
  target: 'hash'
}

const notification2: FilesAddedNotification = {
  actor_id: 'PeerId',
  block_id: 'BlockId',
  body: 'some photo',
  date: '1999-01-01T00:00:00Z',
  id: 'NotificationId2',
  read: false,
  type: NotificationType.FilesAddedNotification,
  threadId: 'threadId2',
  threadName: 'threadName2',
  target: 'hash2'
}

describe('notifications stories', () => {
  describe('initial state', () => {
    it('should match snapshot', () => {
      expect(initialState).toMatchSnapshot()
    })
  })
  describe('refreshing notifications', () => {
    let state0 = reducer(initialState, actions.refreshNotificationsStart())
    it('should start refresh of notifications', () => {
      const match0: NotificationsState = {refreshing: true, notifications: []}
      expect(state0).toMatchObject(match0)
    })
    it('should add notifications', () => {
      state0 = reducer(state0, actions.refreshNotificationsSuccess([notification1]))
      const match1: NotificationsState = {refreshing: false, notifications: [notification1]}
      expect(state0).toMatchObject(match1)
    })
    it('should add single notifications', () => {
      expect(state0.notifications.length).toEqual(1)
      const state2 = reducer(state0, actions.newNotificationRequest(notification2))
      expect(state2.notifications.length).toEqual(2)
      expect(state2.notifications[0]).toMatchObject(notification2)
    })
  })
})
