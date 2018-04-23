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
import IpfsNodeActions from '../Redux/IpfsNodeRedux'

export function * createNode (api, {path}) {
  try {
    const success = yield call(api.createNodeWithDataDir, path)
    if (success) {
      yield put(IpfsNodeActions.createNodeSuccess())
    } else {
      yield put(IpfsNodeActions.createNodeFailure(new Error('Failed creating node, but no error was thrown - Should not happen')))
    }
  } catch (error) {
    yield put(IpfsNodeActions.createNodeFailure(error))
  }
}

export function * startGateway (api) {
  try {
    const success = yield call(api.startGateway)
    if (success) {
      yield put(IpfsNodeActions.startGatewaySuccess())
    } else {
      yield put(IpfsNodeActions.startGatewayFailure(new Error('Failed starting gateway, but no error was thrown - Should not happen')))
    }
  } catch (error) {
    yield put(IpfsNodeActions.startGatewayFailure(error))
  }
}

export function * startNode (api) {
  try {
    const success = yield call(api.startNode)
    if (success) {
      yield put(IpfsNodeActions.startNodeSuccess())
    } else {
      yield put(IpfsNodeActions.startNodeFailure(new Error('Failed starting node, but no error was thrown - Should not happen')))
    }
  } catch (error) {
    yield put(IpfsNodeActions.startNodeFailure(error))
  }
}

export function * pairNewDevice (api, action) {
  const { pubKey } = action
  try {
    yield call(api.pairNewDevice, pubKey)
    yield put(TextileActions.pairNewDeviceSuccess(pubKey))
  } catch (err) {
    yield put(TextileActions.pairNewDeviceError(pubKey))
  }
}
