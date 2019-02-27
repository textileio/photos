import { StateType } from 'typesafe-actions'
import { PersistPartial } from 'redux-persist'

import RootReducer from './RootReducer'
import { AccountAction } from '../features/account'
import { AuthAction } from './AuthRedux'
import { CameraRollAction } from './CameraRollRedux'
import { ContactsAction } from '../features/contacts'
import { DeviceLogsAction } from './DeviceLogsRedux'
import { PhotoViewingAction } from './PhotoViewingRedux'
import { PreferencesAction } from './PreferencesRedux'
import { NotificationsAction } from './NotificationsRedux'
import { ThreadsAction } from './ThreadsRedux'
import { TriggersAction } from './TriggersRedux'
import { UIAction } from './UIRedux'
import { UploadingImagesAction } from './UploadingImagesRedux'
import { StartupAction } from './StartupRedux'
import { TextileEventsActions } from './TextileEventsRedux'
import { GroupAction } from '../features/group'
import { StorageAction } from './StorageRedux'

export type RootState = StateType<typeof RootReducer> & PersistPartial
export type RootAction =
  AccountAction |
  AuthAction |
  CameraRollAction |
  ContactsAction |
  DeviceLogsAction |
  PhotoViewingAction |
  PreferencesAction |
  NotificationsAction |
  ThreadsAction |
  TriggersAction |
  UIAction |
  UploadingImagesAction |
  StartupAction |
  TextileEventsActions |
  GroupAction |
  StorageAction
