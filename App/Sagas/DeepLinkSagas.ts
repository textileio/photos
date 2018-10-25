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
import { call, put, select, take } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import UIActions from '../Redux/UIRedux'
import { ActionType, getType } from 'typesafe-actions'
import Config from 'react-native-config'
import DeepLink from '../Services/DeepLink'
import NavigationService from '../Services/NavigationService'
import {PreferencesSelectors} from '../Redux/PreferencesRedux'
import AuthActions, {AuthSelectors} from '../Redux/AuthRedux'
import StartupActions, {startupSelectors} from '../Redux/StartupRedux'

export function * inviteAfterOnboard () {
  const invite = yield select(AuthSelectors.invite)
  if (invite) {
    // ensures this is the last of the knock-on effects of onboarding
    yield call(delay, 250)
    NavigationService.navigate('ThreadInvite', { ...DeepLink.getParams(invite.hash) })
  }
}

export function * routeThreadInvite(url: string, hash: string ) {
  const reduxStarted: boolean = yield select(startupSelectors.started)
  if (!reduxStarted) {
    yield take(getType(StartupActions.startup))
  }
  const onboarded = yield select(PreferencesSelectors.onboarded)
  if (onboarded) {
    NavigationService.navigate('ThreadInvite', { ...DeepLink.getParams(hash) })
  } else {
    // simply store the pending invite information to act on after onboarding success
    const data = DeepLink.getParams(hash)
    const referral: string = data.referral as string
    if (referral) {
      yield put(AuthActions.onboardWithInviteRequest(url, hash, referral))
    }
  }
}

export function * routeDeepLink (action: ActionType<typeof UIActions.routeDeepLinkRequest>) {
  const { url } = action.payload
  if (!url) { return }
  try {
    // convert url scheme to standard url for parsing
    const scheme = Config.RN_URL_SCHEME
    const regexp = new RegExp(scheme + '://(www.)?textile.photos/')
    const standardUrl = url.replace(regexp, 'https://textile.photos/')
    const data = DeepLink.getData(standardUrl)
    if (data) {
      if (data.path === '/invites/device' && data.hash !== '') {
        // start pairing the new device
        NavigationService.navigate('PairingView', { request: DeepLink.getParams(data.hash) })
      } else if (data.path === '/invites/new' && data.hash !== '') {
        yield call(routeThreadInvite, standardUrl, data.hash)
      }
    }
  } catch (error) {
  }
}
