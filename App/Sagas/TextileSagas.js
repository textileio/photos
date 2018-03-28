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

import { call, put, all } from 'redux-saga/effects'
import TextileActions from '../Redux/TextileRedux'

export function * getRandomUsers (api, action) {
  const { seed, page, results } = action
  // get current data from Store
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

// function* deserialize( action ) {
//   const items = yield select(TextileActions.getItems)
//   // yield put({ type: 'DESERISLIZE_COMPLETE' })
// }

export function * handleNodeStarted () {

  // const interface = yield select(TextileActions.getItems)
  // if (interface.state.textile && interface.state.textile.images && interface.state.textile.images && interface.state.textile.images.items)
  yield put(TextileActions.getHashesRequest('', 10, true))
}

/**
 * Get the list of stored hashes to add to our photo roll
 *
 * @param api - textile-go api
 * @param action - the (offset, limit)
 * @returns {IterableIterator<*>}
 */
export function * getHashes (api, action) {
  const { offsetId, limit, clearItems } = action
  const jsonString = yield call(api.getPhotos, offsetId, limit)
  const json = JSON.parse(jsonString)
  if (json) {
    yield put(TextileActions.getHashesSuccess())
    yield put(TextileActions.getThumbsRequest(json, false, clearItems))
  } else {
    yield put(TextileActions.getHashesFailure())
  }
}

export function * getThumbs (api, action) {
  const { response, prepend, clearItems } = action
  const thumbArray = yield all(response.hashes.map(hash => {
    return call(api.getPhotoData, hash + '/thumb.jpg')
  }))
  const thumbs = thumbArray.map((thumb, i) => {
    return {'hash': response.hashes[i], 'thumb': thumb}
  })
  yield put(TextileActions.getThumbsSuccess(thumbs, prepend, clearItems))
}

export function * addImages (api, response) {
  // First, call api to add the new Image data and get back the hash
  const hashArray = yield all(response.data.map(image => {
    return call(api.addImageAtPath, image.path)
  }))

  // Grab the raw thumbnail data for the hash
  // TODO, we could return thumb as part of addImageAtPath
  const thumbArray = yield all(hashArray.map(hash => {
    return call(api.getPhotoData, hash + '/thumb.jpg')
  }))

  // Combine our two arrays into the required format
  const newData = thumbArray.map((thumb, i) => {
    return {'hash': hashArray[i], 'thumb': thumb}
  })

  yield put(TextileActions.getThumbsSuccess(newData, true, false))
}
