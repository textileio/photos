import { all, take, select, call, put } from 'redux-saga/effects'
import { getType } from 'typesafe-actions'
import { requestLocalPhotos, LocalPhotoResult } from '@textile/react-native-camera-roll'

import * as actions from './actions'
import * as selectors from './selectors'
import { RootState } from '../../Redux/Types'
import UIActions from '../../Redux/UIRedux'
import { SharedImage } from '../group/add-photo/models'

function * refreshLocalImages () {
  while (yield take(getType(actions.queryPhotos.request))) {
    try {
      const lastRefresh: number | undefined = yield select((state: RootState) => selectors.lastQueriedTime(state.photos))
      const currentRefresh = (new Date()).getTime()
      // TODO: if we've never queried before, doing this for now until we decide we want to query back in time
      const since = lastRefresh || currentRefresh
      const results: LocalPhotoResult[] = yield call(requestLocalPhotos, since)
      for (const result of results) {
        // TODO: for now just use our image sharing pipeline, maybe we want to change this
        const sharedImage: SharedImage = {
          isAvatar: false,
          uri: result.uri,
          path: result.path,
          canDelete: result.canDelete
        }
        // yield put(UIActions.sharePhotoRequest(sharedImage))
      }
      yield put(actions.updateLastQueriedTime(currentRefresh))
    } catch (error) {
      yield put(actions.queryPhotos.failure(error))
    }
  }
}

export default function * () {
  yield all([
    call(refreshLocalImages)
  ])
}
