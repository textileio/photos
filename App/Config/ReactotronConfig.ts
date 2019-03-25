import { NativeModules } from 'react-native'
import Reactotron, { trackGlobalErrors, asyncStorage, networking } from 'reactotron-react-native'
import { reactotronRedux } from 'reactotron-redux'

const scriptURL = NativeModules.SourceCode.scriptURL
const scriptHostname = scriptURL.split('://')[1].split(':')[0]

const reactotron = Reactotron
  .useReactNative!({})
  .configure({ host: scriptHostname, name: 'Textile' })
  .use(trackGlobalErrors({}))
  .use(asyncStorage({}))
  .use(networking())
  .use(reactotronRedux())
  .connect()

export default reactotron
