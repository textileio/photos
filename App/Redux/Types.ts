import { StateType } from 'typesafe-actions'

import RootReducer from './RootReducer'
import { AuthAction } from './AuthRedux'
import { CameraRollAction } from './CameraRollRedux'
import { ContactsAction } from './ContactsRedux'
import { DevicesAction } from './DevicesRedux'
import { PreferencesAction } from './PreferencesRedux'
import { TextileNodeAction } from './TextileNodeRedux'
import { ThreadsAction } from './ThreadsRedux'
import { UIAction } from './UIRedux'
import { UploadingImagesAction } from './UploadingImagesRedux'

export type RootState = StateType<typeof RootReducer>
export type RootAction = 
  AuthAction |
  CameraRollAction |
  ContactsAction |
  DevicesAction |
  PreferencesAction |
  TextileNodeAction |
  ThreadsAction |
  UIAction |
  UploadingImagesAction
  