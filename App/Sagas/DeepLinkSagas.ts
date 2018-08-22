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
import { Platform } from 'react-native'
import { call, put, select } from 'redux-saga/effects'
import UIActions from '../Redux/UIRedux'
import { ActionType } from 'typesafe-actions'
import DeepLink from '../Services/DeepLink'
import NavigationService from '../Services/NavigationService'

export function routeDeepLink (action: ActionType<typeof UIActions.routeDeepLinkRequest>) {
  const { url } = action.payload
  if (!url) return
  try {
    const data = DeepLink.getData(url)
    if (data) {
      if (data.path === '/invites/device' && data.hash !== '') {
        // start pairing the new device
        NavigationService.navigate('PairingView', { request: DeepLink.getParams(data.hash) })
      } else if (data.path === '/invites/new' && data.hash !== '') {
        // invite the user to the thread
        NavigationService.navigate('ThreadInvite', { url, request: DeepLink.getParams(data.hash) })
      }
    }
  } catch (error) {
    console.log('axh deeplink error', error)
  }
}
