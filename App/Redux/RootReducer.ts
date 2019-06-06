import { combineReducers } from 'redux'

import { accountReducer } from '../features/account'
import { reducer as authReducer } from './AuthRedux'
import { reducer as cameraRollReducer } from './CameraRollRedux'
import { contactsReducer } from '../features/contacts'
import { reducer as photoViewingReducer } from './PhotoViewingRedux'
import { reducer as prefrencesReducer } from './PreferencesRedux'
import { reducer as notificationsReducer } from './NotificationsRedux'
import { reducer as threadsReducer } from './ThreadsRedux'
import { reducer as uiReducer } from './UIRedux'
import { reducer as uploadingImagesReducer } from './UploadingImagesRedux'
import { reducer as startupReducer } from './StartupRedux'
import { reducer as deviceLogsReducer } from './DeviceLogsRedux'
import { groupReducer } from '../features/group'
import { nodeStatusReducer } from '../features/node-status'
import { photosReducer } from '../features/photos'

export default combineReducers({
  auth: authReducer,
  cameraRoll: cameraRollReducer,
  contacts: contactsReducer,
  photoViewing: photoViewingReducer,
  preferences: prefrencesReducer,
  notifications: notificationsReducer,
  threads: threadsReducer,
  ui: uiReducer,
  uploadingImages: uploadingImagesReducer,
  startup: startupReducer,
  deviceLogs: deviceLogsReducer,
  account: accountReducer,
  group: groupReducer,
  nodeStatus: nodeStatusReducer,
  photos: photosReducer
})
