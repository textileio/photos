import actions, { reducer, NotificationsState } from '../NotificationsRedux'
import {
  PhotoAddedNotification,
  NotificationType
} from '../../Models/TextileTypes'

const initialState = reducer(undefined, {} as any)

const notification1: PhotoAddedNotification = {
  actor_id: 'PeerId' as any,
  actor_username: 'UserName' as any,
  block_id: 'BlockId' as any,
  body: 'some photo',
  date: '1999-01-01T00:00:00Z',
  id: 'NotificationId1' as any,
  read: false,
  type: NotificationType.photoAddedNotification,
  threadId: 'threadId1' as any,
  threadName: 'threadName1' as any,
  photoId: 'photoId1' as any
}

const notification2: PhotoAddedNotification = {
  actor_id: 'PeerId' as any,
  actor_username: 'UserName' as any,
  block_id: 'BlockId' as any,
  body: 'some photo',
  date: '1999-01-01T00:00:00Z',
  id: 'NotificationId2' as any,
  read: false,
  type: NotificationType.photoAddedNotification,
  threadId: 'threadId2' as any,
  threadName: 'threadName2' as any,
  photoId: 'photoId2' as any
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
