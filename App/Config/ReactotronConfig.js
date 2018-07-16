import Config from '../Config/DebugConfig'
import { NativeModules } from 'react-native';
import Immutable from 'seamless-immutable'
import Reactotron, { trackGlobalErrors, openInEditor, asyncStorage } from 'reactotron-react-native'
import { reactotronRedux as reduxPlugin } from 'reactotron-redux'
import sagaPlugin from 'reactotron-redux-saga'

if (Config.useReactotron) {
  // https://github.com/infinitered/reactotron for more options!
  const scriptURL = NativeModules.SourceCode.scriptURL
  const scriptHostname = scriptURL.split('://')[1].split(':')[0];
  Reactotron
    .configure({ host: scriptHostname, name: 'Ignite App' })
    .use(trackGlobalErrors())
    .use(openInEditor())
    .useReactNative()
    .use(asyncStorage())
    .use(reduxPlugin({ onRestore: Immutable }))
    .use(sagaPlugin())
    .connect()

  // Let's clear Reactotron on every time we load the app
  Reactotron.clear()

  // Totally hacky, but this allows you to not both importing reactotron-react-native
  // on every file.  This is just DEV mode, so no big deal.
  console.tron = Reactotron
}
