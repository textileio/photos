/* @flow */
import { createStackNavigator } from 'react-navigation'
import TextilePhotos from '../Containers/TextilePhotos'
import LogView from '../Containers/LogView'
import PairingView from '../Containers/PairingView'
// import Notifications from '../Containers/Notifications'
// import Text from 'react-native'
// import Image from 'react-native-scalable-image'

// import SwipeNavigation from './SwipeNavigation'

import styles from './Styles/NavigationStyles'

// Manifest of possible screens
const PrimaryNav = createStackNavigator(
  {
    TextilePhotos: { screen: TextilePhotos },
    LogView: { screen: LogView },
    PairingView: { screen: PairingView },
  },
  {
    // Default config for all screens
    headerMode: 'float',
    initialRouteName: 'TextilePhotos',
    navigationOptions: {
      // headerLeft: (<Image source={require('../Images/textile-icon.png')} style={styles.logo} />),
      headerStyle: styles.header,
      headerTitleStyle: styles.title,
      title: 'Latest'
    }
  }
)

export default PrimaryNav
