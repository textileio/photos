import { all, takeEvery, put, call } from 'redux-saga/effects'
import Config from 'react-native-config'
import { ActionType, getType } from 'typesafe-actions'
import Textile from '@textile/react-native-sdk'

import * as actions from './actions'
import lbApi from '../../Services/textile-lb-api'
import { refreshCafeSessionsRequest } from '../account/actions'

function* getRecommendedCafes() {
  const lbUrl: string | undefined = Config.RN_TEXTILE_LB_URL
  if (lbUrl) {
    const recommendedCafes = yield call(lbApi(lbUrl).discoveredCafes)
    yield put(actions.getRecommendedCafes.success(recommendedCafes))
  } else {
    yield put(
      actions.getRecommendedCafes.failure({
        message: 'No lb url specified in config'
      })
    )
  }
}

function* registerCafe(
  action: ActionType<typeof actions.registerCafe.request>
) {
  const { peerId, token, success } = action.payload
  try {
    yield call(Textile.cafes.register, peerId, token)
    yield put(actions.registerCafe.success(peerId))
    yield put(refreshCafeSessionsRequest())
    if (success) {
      yield call(success)
    }
  } catch (error) {
    yield put(actions.registerCafe.failure({ peerId, error }))
  }
}

function* deregisterCafe(
  action: ActionType<typeof actions.deregisterCafe.request>
) {
  const { id, success } = action.payload
  try {
    yield call(Textile.cafes.deregister, id)
    yield put(actions.deregisterCafe.success(id))
    yield put(refreshCafeSessionsRequest())
    if (success) {
      yield call(success)
    }
  } catch (error) {
    yield put(actions.deregisterCafe.failure({ id, error }))
  }
}

export default function*() {
  yield all([
    takeEvery(
      getType(actions.getRecommendedCafes.request),
      getRecommendedCafes
    ),
    takeEvery(getType(actions.registerCafe.request), registerCafe),
    takeEvery(getType(actions.deregisterCafe.request), deregisterCafe)
  ])
}
