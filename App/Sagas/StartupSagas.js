import RNFS from 'react-native-fs'
import { put, select } from 'redux-saga/effects'
import IpfsNodeActions from '../Redux/IpfsNodeRedux'
import { is } from 'ramda'

// exported to make available for tests
// export const selectAvatar = GithubSelectors.selectAvatar

// process STARTUP actions
export function * startup () {
  if (__DEV__ && console.tron) {
    // straight-up string logging
    console.tron.log('Hello, I\'m an example of how to log via Reactotron.')

    // logging an object for better clarity
    console.tron.log({
      message: 'pass objects for better logging'
    })

    // fully customized!
    const subObject = { a: 1, b: [1, 2, 3], c: true }
    subObject.circularDependency = subObject // osnap!
    console.tron.display({
      name: '🔥 IGNITE 🔥',
      preview: 'You should totally expand this',
      value: {
        '💃': 'Welcome to the future!',
        subObject,
        someInlineFunction: () => true,
        someGeneratorFunction: startup
      }
    })
  }

  yield put(IpfsNodeActions.createNodeRequest(RNFS.DocumentDirectoryPath))
  yield put(IpfsNodeActions.startNodeRequest())
  yield put(IpfsNodeActions.getPhotoHashesRequest())
}
