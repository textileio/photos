import { takeLatest, takeEvery, all } from 'redux-saga/effects'

/* ------------- Types ------------- */

import {StartupTypes} from '../Redux/StartupRedux'
import {TextileTypes} from '../Redux/TextileRedux'
import {IpfsNodeTypes} from '../Redux/IpfsNodeRedux'

/* ------------- Sagas ------------- */

import {startup} from './StartupSagas'
import {
  createNode,
  startGateway,
  startNode,
  pairNewDevice,
  photosTask
} from './TextileSagas'

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield all([
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup),

    // some sagas receive extra parameters in addition to an action

    takeLatest(IpfsNodeTypes.CREATE_NODE_REQUEST, createNode),
    takeLatest(IpfsNodeTypes.START_GATEWAY_REQUEST, startGateway),
    takeLatest(IpfsNodeTypes.START_NODE_REQUEST, startNode),
    takeLatest(TextileTypes.PAIR_NEW_DEVICE, pairNewDevice),

    takeEvery(TextileTypes.APP_STATE_CHANGE, photosTask),
    takeEvery(TextileTypes.LOCATION_UPDATE, photosTask)
  ])
}
