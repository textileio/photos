import { combineReducers } from 'redux'

import { reducer as accountReducer } from './AccountRedux'
import { reducer as authReducer } from './AuthRedux'
import { reducer as cameraRollReducer } from './CameraRollRedux'
import { contactsReducer } from '../features/contacts'
import { reducer as photoViewingReducer } from './PhotoViewingRedux'
import { reducer as prefrencesReducer } from './PreferencesRedux'
import { reducer as notificationsReducer } from './NotificationsRedux'
import { reducer as threadsReducer } from './ThreadsRedux'
import { reducer as uiReducer } from './UIRedux'
import { reducer as uploadingImagesReducer } from './UploadingImagesRedux'
import { reducer as storageReducer } from './StorageRedux'
import { reducer as startupReducer } from './StartupRedux'
import { reducer as deviceLogsReducer } from './DeviceLogsRedux'
import { reducer as textileEventsReducer } from './TextileEventsRedux'
import { groupReducer } from '../features/group'

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
  storage: storageReducer,
  startup: startupReducer,
  deviceLogs: deviceLogsReducer,
  account: accountReducer,
  textile: textileEventsReducer,
  group: groupReducer
})
