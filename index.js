// import './App/Config/ReactotronConfig'
// import {AppRegistry, YellowBox} from 'react-native'
import {AppRegistry} from 'react-native'
import App from './App/Containers/App'

// YellowBox.ignoreWarnings([
//   'Warning: isMounted(...) is deprecated',
//   'Module RCTImageLoader requires main queue setup',
//   'Class RCTCxxModule was not exported',
//   'RCTBridge required dispatch_sync to load RCTDevLoadingView'
// ])

AppRegistry.registerComponent('TextilePhotos', () => App)
