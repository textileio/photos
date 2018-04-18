import { takeLatest, all } from 'redux-saga/effects'
import IPFS from '../../TextileIPFSNativeModule'

/* ------------- Types ------------- */

import {StartupTypes} from '../Redux/StartupRedux'
import {TextileTypes} from '../Redux/TextileRedux'
import {IpfsNodeTypes} from '../Redux/IpfsNodeRedux'

/* ------------- Sagas ------------- */

import {selectRandomUserData, startup} from './StartupSagas'
import {
  createNode,
  startGateway,
  startNode,
  handleNodeStarted,
  getHashes,
  getThumbs,
  addImages,
  pairNewDevice
} from './TextileSagas'

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield all([
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup),

    // some sagas receive extra parameters in addition to an action

    takeLatest(IpfsNodeTypes.CREATE_NODE_REQUEST, createNode, IPFS),
    takeLatest(IpfsNodeTypes.START_GATEWAY_REQUEST, startGateway, IPFS),
    takeLatest(IpfsNodeTypes.START_NODE_REQUEST, startNode, IPFS),
    takeLatest(IpfsNodeTypes.START_NODE_SUCCESS, handleNodeStarted),
    takeLatest(TextileTypes.GET_HASHES_REQUEST, getHashes, IPFS),
    takeLatest(TextileTypes.GET_THUMBS_REQUEST, getThumbs, IPFS),
    takeLatest(TextileTypes.ADD_IMAGES_REQUEST, addImages, IPFS),
    takeLatest(TextileTypes.PAIR_NEW_DEVICE, pairNewDevice, IPFS)
  ])
}
