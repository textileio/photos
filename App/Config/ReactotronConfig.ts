import Config from '../Config/DebugConfig'
import { NativeModules } from 'react-native'
import Reactotron, { trackGlobalErrors, openInEditor, asyncStorage } from 'reactotron-react-native'
import { reactotronRedux } from 'reactotron-redux'
import sagaPlugin from 'reactotron-redux-saga'

if (Config.useReactotron) {
  const scriptURL = NativeModules.SourceCode.scriptURL
  const scriptHostname = scriptURL.split('://')[1].split(':')[0]
  Reactotron
    .configure({ host: scriptHostname, name: 'Textile' })
    .use(trackGlobalErrors())
    .use(openInEditor())
    .useReactNative()
    .use(asyncStorage())
    .use(reactotronRedux())
    .use(sagaPlugin())
    .connect()
  Reactotron.clear()
}
