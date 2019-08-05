import { StateType } from 'typesafe-actions'
import { PersistPartial } from 'redux-persist'

import RootReducer from './RootReducer'
import { AccountAction } from '../features/account'
import { AuthAction } from './AuthRedux'
import { ContactsAction } from '../features/contacts'
import { DeviceLogsAction } from './DeviceLogsRedux'
import { GroupsAction } from './GroupsRedux'
import { PreferencesAction } from './PreferencesRedux'
import { NotificationsAction } from './NotificationsRedux'
import { ThreadsAction } from './ThreadsRedux'
import { TriggersAction } from './TriggersRedux'
import { UIAction } from './UIRedux'
import { StartupAction } from './StartupRedux'
import { TextileEventsAction } from './TextileEventsRedux'
import { GroupAction } from '../features/group'
import { CafesAction } from '../features/cafes'

export type RootState = StateType<typeof RootReducer> & PersistPartial
export type RootAction =
  | AccountAction
  | AuthAction
  | ContactsAction
  | DeviceLogsAction
  | GroupsAction
  | PreferencesAction
  | NotificationsAction
  | ThreadsAction
  | TriggersAction
  | UIAction
  | StartupAction
  | TextileEventsAction
  | GroupAction
  | CafesAction
