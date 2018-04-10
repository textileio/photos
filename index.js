import './App/Config/ReactotronConfig'
import { AppRegistry, AsyncStorage } from 'react-native'
import deviceLog from 'react-native-device-log'
import App from './App/Containers/App'

deviceLog.init(AsyncStorage
  , {
    //Options (all optional):
    logToConsole: true, //Send logs to console as well as device-log
    logRNErrors: true, // Will pick up RN-errors and send them to the device log
    maxNumberToRender: 2000, // 0 or undefined == unlimited
    maxNumberToPersist: 2000 // 0 or undefined == unlimited
  }).then(() => {

  //When the deviceLog has been initialized we can clear it if we want to:
  //deviceLog.clear();

})

global.deviceLog = deviceLog

AppRegistry.registerComponent('TextilePhotos', () => App)
