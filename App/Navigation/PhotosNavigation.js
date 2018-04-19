/* @flow */
import React from 'react'
import DismissableStackNavigator from '../Components/DismissableStackNavigator'
import { StackNavigator } from 'react-navigation'
import TextilePhotos from '../Containers/TextilePhotos'
import InfoView from '../Containers/InfoView'
import PairingView from '../Containers/PairingView'
import PhotoViewerScreen from '../Containers/PhotoViewerScreen'
// import Notifications from '../Containers/Notifications'
// import Image from 'react-native'

// import SwipeNavigation from './SwipeNavigation'

import styles, {headerTintColor} from './Styles/NavigationStyles'

// Manifest of possible screens
const PrimaryNav = StackNavigator(
  {
    TextilePhotos: TextilePhotos,
    InfoView: InfoView,
    PairingView: PairingView
  },
  {
    // Default config for all screens
    headerMode: 'float',
    initialRouteName: 'TextilePhotos',
    navigationOptions: {
      headerStyle: styles.header,
      headerTitleStyle: styles.headerTitle,
      headerTintColor: headerTintColor
    }
  }
)

const RootStack = DismissableStackNavigator(
  {
    PrimaryNav: {
      screen: PrimaryNav,
    },
    PhotoViewer: {
      screen: PhotoViewerScreen,
    },
  },
  {
    mode: 'modal',
    headerMode: 'none'
  }
)

export default RootStack
