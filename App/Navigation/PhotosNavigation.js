/* @flow */
import React from 'react'
import { StackNavigator } from 'react-navigation'
import TextilePhotos from '../Containers/TextilePhotos'
import Text from 'react-native'
import Image from 'react-native-scalable-image'

import styles from './Styles/NavigationStyles'

// Manifest of possible screens
const PrimaryNav = StackNavigator(
  {
    TextilePhotos: { screen: TextilePhotos },
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
