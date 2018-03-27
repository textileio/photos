import { takeLatest, all } from 'redux-saga/effects'
import API from '../Services/Api'
import RandomUserApi from '../Services/RandomUserApi'
import FixtureAPI from '../Services/FixtureApi'
import DebugConfig from '../Config/DebugConfig'
import IPFS from '../../TextileIPFSNativeModule'

/* ------------- Types ------------- */

import { StartupTypes } from '../Redux/StartupRedux'
import { GithubTypes } from '../Redux/GithubRedux'
import { TextileTypes } from '../Redux/TextileRedux'

/* ------------- Sagas ------------- */

import { startup } from './StartupSagas'
import { getUserAvatar } from './GithubSagas'
import {
  getRandomUsers,
  createNode,
  startNode
} from './TextileSagas'

/* ------------- API ------------- */

// The API we use is only used from Sagas, so we create it here and pass along
// to the sagas which need it.
const api = DebugConfig.useFixtures ? FixtureAPI : API.create()
const randomUserApi = RandomUserApi.create()

/* ------------- Connect Types To Sagas ------------- */

export default function * root () {
  yield all([
    // some sagas only receive an action
    takeLatest(StartupTypes.STARTUP, startup),

    // some sagas receive extra parameters in addition to an action
    takeLatest(GithubTypes.USER_REQUEST, getUserAvatar, api),

    takeLatest(TextileTypes.RANDOM_USERS_REQUEST, getRandomUsers, randomUserApi),

    takeLatest(TextileTypes.CREATE_NODE, createNode, IPFS),
    takeLatest(TextileTypes.START_NODE_REQUEST, startNode, IPFS)
  ])
}
