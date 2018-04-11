/* @flow */
import React from 'react'
import { createStackNavigator } from 'react-navigation'
import TextilePhotos from '../Containers/TextilePhotos'
import LogScreen from '../Containers/LogScreen'
import PairingView from '../Containers/PairingView'
// import Notifications from '../Containers/Notifications'
// import Image from 'react-native'
import Image from 'react-native-scalable-image'

// import SwipeNavigation from './SwipeNavigation'

import styles from './Styles/NavigationStyles'

// Manifest of possible screens
const PrimaryNav = createStackNavigator(
  {
    TextilePhotos: { screen: TextilePhotos },
    LogScreen: { screen: LogScreen },
    PairingView: { screen: PairingView }
  },
  {
    // Default config for all screens
    headerMode: 'float',
    initialRouteName: 'TextilePhotos',
    navigationOptions: {
      // headerLeft: (<Image source={require('../Images/textile-icon.png')} style={styles.logo} />),
      headerStyle: styles.header,
      headerTitleStyle: styles.title,
      // title: 'Latest',
      headerTitle: (
        <Image style={{ width: 90, height: 39, resizeMode: 'contain', alignSelf: 'center' }} source={require('../Images/TextileHeader.png')} />
      )
    }
  }
)

export default PrimaryNav
