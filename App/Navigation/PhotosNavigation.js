/* @flow */
import React from 'react'
import { StackNavigator } from 'react-navigation'
import TextilePhotos from '../Containers/TextilePhotos'
import PairingView from '../Containers/PairingView'
// import Notifications from '../Containers/Notifications'
// import Image from 'react-native'

// import SwipeNavigation from './SwipeNavigation'

import styles from './Styles/NavigationStyles'

// Manifest of possible screens
const PrimaryNav = StackNavigator(
  {
    TextilePhotos: TextilePhotos,
    PairingView: PairingView
  },
  {
    // Default config for all screens
    headerMode: 'float',
    initialRouteName: 'TextilePhotos',
    navigationOptions: {
      headerStyle: styles.header,
      headerTitleStyle: styles.headerTitle
    }
  }
)

export default PrimaryNav
