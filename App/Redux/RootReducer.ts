import { combineReducers } from 'redux'

import { accountReducer } from '../features/account'
import { reducer as authReducer } from './AuthRedux'
import { contactsReducer } from '../features/contacts'
import { reducer as photoViewingReducer } from './PhotoViewingRedux'
import { reducer as prefrencesReducer } from './PreferencesRedux'
import { reducer as notificationsReducer } from './NotificationsRedux'
import { reducer as threadsReducer } from './ThreadsRedux'
import { reducer as uiReducer } from './UIRedux'
import { reducer as uploadingImagesReducer } from './UploadingImagesRedux'
import { reducer as startupReducer } from './StartupRedux'
import { reducer as deviceLogsReducer } from './DeviceLogsRedux'
import { reducer as textileEventsReducer } from './TextileEventsRedux'
import { groupReducer } from '../features/group'
import { photosReducer } from '../features/photos'

export default combineReducers({
  auth: authReducer,
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
  textile: textileEventsReducer,
  group: groupReducer,
  photos: photosReducer
})
