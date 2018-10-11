import './App/Config/ReactotronConfig'
import { AppRegistry } from 'react-native'
import App from './App/Containers/App'
import { name as appName } from './app.json'
import { initErrorHandler } from './App/Services/ErrorHandler'

initErrorHandler()

AppRegistry.registerComponent(appName, () => App)
