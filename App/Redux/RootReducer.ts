import { combineReducers } from 'redux'

import { reducer as authReducer } from './AuthRedux'
import { reducer as cameraRollReducer } from './CameraRollRedux'
import { reducer as contactsReducer } from './ContactsRedux'
import { reducer as devicesReducer } from './DevicesRedux'
import { reducer as photoViewingReducer } from './PhotoViewingRedux'
import { reducer as prefrencesReducer } from './PreferencesRedux'
import { reducer as notificationsReducer } from './NotificationsRedux'
import { reducer as textileNodeReducer } from './TextileNodeRedux'
import { reducer as threadsReducer } from './ThreadsRedux'
import { reducer as uiReducer } from './UIRedux'
import { reducer as uploadingImagesReducer } from './UploadingImagesRedux'
import { reducer as processingImagesReducer } from './ProcessingImagesRedux'
import { reducer as storageReducer } from './StorageRedux'
import { reducer as startupReducer } from './StartupRedux'
import { reducer as deviceLogsReducer } from './DeviceLogsRedux'

export default combineReducers({
  auth: authReducer,
  cameraRoll: cameraRollReducer,
  contacts: contactsReducer,
  devices: devicesReducer,
  photoViewing: photoViewingReducer,
  preferences: prefrencesReducer,
  notifications: notificationsReducer,
  textileNode: textileNodeReducer,
  threads: threadsReducer,
  ui: uiReducer,
  uploadingImages: uploadingImagesReducer,
  processingImages: processingImagesReducer,
  storage: storageReducer,
  startup: startupReducer,
  deviceLogs: deviceLogsReducer
})
