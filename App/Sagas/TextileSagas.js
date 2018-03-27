/* ***********************************************************
* A short word on how to use this automagically generated file.
* We're often asked in the ignite gitter channel how to connect
* to a to a third party api, so we thought we'd demonstrate - but
* you should know you can use sagas for other flow control too.
*
* Other points:
*  - You'll need to add this saga to sagas/index.js
*  - This template uses the api declared in sagas/index.js, so
*    you'll need to define a constant in that file.
*************************************************************/

import { call, put } from 'redux-saga/effects'
import TextileActions from '../Redux/TextileRedux'
// import { TextileSelectors } from '../Redux/TextileRedux'

export function * getRandomUsers (api, action) {
  const { seed, page, results } = action
  // get current data from Store
  // const currentData = yield select(TextileSelectors.getData)
  // make the call to the api
  const response = yield call(api.getUsers, seed, page, results)

  // success?
  if (response.ok) {
    // You might need to change the response here - do this with a 'transform',
    // located in ../Transforms/. Otherwise, just pass the data back from the api.
    yield put(TextileActions.randomUsersRequestSuccess(response.data))
  } else {
    yield put(TextileActions.randomUsersRequestFailure())
  }
}

export function * createNode (api, action) {
  const { path, apiHost } = action
  yield call(api.createNodeWithDataDir, path, apiHost)
}

export function * startNode (api) {
  const success = yield call(api.startNode)
  if (success) {
    yield put(TextileActions.startNodeSuccess())
  } else {
    yield put(TextileActions.startNodeFailure())
  }
}

export function * getPhotos (api, action) {
  const { offset, limit } = action
  const jsonString = yield call(api.getPhotos, offset, limit)
  const json = JSON.parse(jsonString)
  if (json) {
    yield put(TextileActions.getPhotosSuccess(json))
  } else {
    yield put(TextileActions.getPhotosFailure())
  }
}
