import { StateType } from 'typesafe-actions'
import { PersistPartial } from 'redux-persist'

import RootReducer from './RootReducer'
import { AuthAction } from './AuthRedux'
import { CameraRollAction } from './CameraRollRedux'
import { ContactsAction } from './ContactsRedux'
import { DevicesAction } from './DevicesRedux'
import { PhotoViewingAction } from './PhotoViewingRedux'
import { PreferencesAction } from './PreferencesRedux'
import { ProcessingImagesAction } from './ProcessingImagesRedux'
import { NotificationsAction } from './NotificationsRedux'
import { TextileNodeAction } from './TextileNodeRedux'
import { ThreadsAction } from './ThreadsRedux'
import { TriggersAction } from './TriggersRedux'
import { UIAction } from './UIRedux'
import { UploadingImagesAction } from './UploadingImagesRedux'
import { StartupAction } from './StartupRedux'

export type RootState = StateType<typeof RootReducer> & PersistPartial
export type RootAction =
  AuthAction |
  CameraRollAction |
  ContactsAction |
  DevicesAction |
  PhotoViewingAction |
  PreferencesAction |
  ProcessingImagesAction |
  NotificationsAction |
  TextileNodeAction |
  ThreadsAction |
  TriggersAction |
  UIAction |
  UploadingImagesAction |
  StartupAction
