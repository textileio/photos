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
import {resizeImage} from '../Services/PhotoUtils'
import TextileActions, { getHashesFailure } from '../Redux/TextileRedux'

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

export function * getThumb (request) {
  const { api, hash } = request
  try {
    const thumb = yield call(api.getPhotoData, hash + '/thumb.jpg')
    return {'hash': hash, 'thumb': thumb}
  } catch (err) {
    console.log(err)
  }
}

export function * getThumbs (api, action) {
  const { response, prepend, clearItems } = action
  const thumbs = yield response.hashes.map(hash => call(getThumb, {api, hash}))
  yield put(TextileActions.getThumbsSuccess(thumbs, prepend, clearItems))
}

function * uploadImage (request) {
  const { api, image } = request
  try {
    const thumbPath = yield call(resizeImage, image.path)
    const hash = yield call(api.addImageAtPath, image.path, thumbPath)
    // todo: we should return the thumb at the same time as the hash above
    const thumb = yield call(getThumb, {api, hash})
    yield put(TextileActions.getThumbsSuccess([thumb], true, false))
  } catch (err) {
    console.log(err)
  }
}

export function * addImages (api, response) {
  yield response.data.map(image => call(uploadImage, {api, image}))
}
