import { all, takeEvery, put, call } from 'redux-saga/effects'
import Config from 'react-native-config'
import { getType } from 'typesafe-actions'

import * as actions from './actions'
import lbApi from '../../Services/textile-lb-api'

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

export default function*() {
  yield all([
    takeEvery(getType(actions.getRecommendedCafes.request), getRecommendedCafes)
  ])
}
