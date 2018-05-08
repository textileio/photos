import { takeLatest, takeEvery, all } from 'redux-saga/effects'

/* ------------- Types ------------- */

import {StartupTypes} from '../Redux/StartupRedux'
import {TextileTypes} from '../Redux/TextileRedux'
import {UITypes} from '../Redux/UIRedux'
import {IpfsNodeTypes} from '../Redux/IpfsNodeRedux'
import {AuthTypes} from '../Redux/AuthRedux'

/* ------------- Sagas ------------- */

import {startup} from './StartupSagas'
import {
  signUp,
  logIn,
  recoverPassword,
  createNode,
  startNode,
  stopNode,
  pairNewDevice,
  getPhotoHashes,
  shareImage,
  refreshThreads,
  photosTask,
  removePayloadFile
} from './TextileSagas'

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield all([
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup),

    // some sagas receive extra parameters in addition to an action

    takeEvery(AuthTypes.SIGN_UP_REQUEST, signUp),
    takeEvery(AuthTypes.LOG_IN_REQUEST, logIn),
    takeEvery(AuthTypes.RECOVER_PASSWORD_REQUEST, recoverPassword),

    takeLatest(IpfsNodeTypes.CREATE_NODE_REQUEST, createNode),
    takeLatest(IpfsNodeTypes.START_NODE_REQUEST, startNode),
    takeLatest(TextileTypes.PAIR_NEW_DEVICE, pairNewDevice),

    takeEvery(action => action.type === TextileTypes.APP_STATE_CHANGE && action.newState === 'inactive', stopNode),

    takeEvery(IpfsNodeTypes.GET_PHOTO_HASHES_REQUEST, getPhotoHashes),

    takeEvery(UITypes.SHARE_PHOTO_REQUEST, shareImage),

    takeEvery(action => action.type === TextileTypes.APP_STATE_CHANGE && action.newState === 'active', photosTask),
    takeEvery(TextileTypes.LOCATION_UPDATE, photosTask),
    takeEvery(TextileTypes.BACKGROUND_TASK, photosTask),

    takeEvery(TextileTypes.IMAGE_UPLOAD_COMPLETE, removePayloadFile)
  ])
}
