import actions, { reducer, NotificationsState } from '../NotificationsRedux'
import {
  BlockId,
  GetNotificationsResult,
  Notification,
  NotificationId,
  PeerId,
  TextileId,
  UserName
} from '../../Models/TextileTypes'

const initialState = reducer(undefined, {} as any)

const notification1: Notification = {
  actor_id: 'PeerId' as any,
  actor_username: 'UserName' as any,
  block_id: 'BlockId' as any,
  body: 'some photo',
  data_id: 'TextileId' as any,
  date: '1999-01-01T00:00:00Z',
  id: 'NotificationId' as any,
  read: false,
  subject: 'a notification',
  subject_id: 'TextileId' as any,
  type: 2
}

const notification2: Notification = {
  actor_id: 'abc' as any,
  actor_username: 'UserName' as any,
  block_id: 'BlockId' as any,
  body: 'some other photo',
  data_id: 'TextileId' as any,
  date: '1999-01-02T00:00:00Z',
  id: 'NotificationId' as any,
  read: false,
  subject: 'a notification',
  subject_id: 'TextileId' as any,
  type: 2
}

const getResult: GetNotificationsResult = {items: [notification1]}

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
      state0 = reducer(state0, actions.refreshNotificationsSuccess(getResult.items))
      const match1: NotificationsState = {refreshing: false, notifications: getResult.items}
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
