import { StateType } from 'typesafe-actions'
import { PersistPartial } from 'redux-persist'

import RootReducer from './RootReducer'
import { AuthAction } from './AuthRedux'
import { CameraRollAction } from './CameraRollRedux'
import { ContactsAction } from './ContactsRedux'
import { DevicesAction } from './DevicesRedux'
import { PreferencesAction } from './PreferencesRedux'
import { NotificationsAction } from './NotificationsRedux'
import { TextileNodeAction } from './TextileNodeRedux'
import { ThreadsAction } from './ThreadsRedux'
import { UIAction } from './UIRedux'
import { UploadingImagesAction } from './UploadingImagesRedux'

export type RootState = StateType<typeof RootReducer> & PersistPartial
export type RootAction =
  AuthAction |
  CameraRollAction |
  ContactsAction |
  DevicesAction |
  PreferencesAction |
  NotificationsAction |
  TextileNodeAction |
  ThreadsAction |
  UIAction |
  UploadingImagesAction
