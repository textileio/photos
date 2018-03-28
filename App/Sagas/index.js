import { takeLatest, all } from 'redux-saga/effects'
import RandomUserApi from '../Services/RandomUserApi'
import IPFS from '../../TextileIPFSNativeModule'

/* ------------- Types ------------- */

import { StartupTypes } from '../Redux/StartupRedux'
import { TextileTypes } from '../Redux/TextileRedux'

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas'
import {
  getRandomUsers,
  createNode,
  startNode,
  handleNodeStarted,
  getHashes,
  getThumbs
} from './TextileSagas'

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const randomUserApi = RandomUserApi.create()

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield all([
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup),

    // some sagas receive extra parameters in addition to an action

    takeLatest(TextileTypes.RANDOM_USERS_REQUEST, getRandomUsers, randomUserApi),

    takeLatest(TextileTypes.CREATE_NODE, createNode, IPFS),
    takeLatest(TextileTypes.START_NODE_REQUEST, startNode, IPFS),
    takeLatest(TextileTypes.START_NODE_SUCCESS, handleNodeStarted),
    takeLatest(TextileTypes.GET_HASHES_REQUEST, getHashes, IPFS),
    takeLatest(TextileTypes.GET_THUMBS_REQUEST, getThumbs, IPFS)
  ])
}
