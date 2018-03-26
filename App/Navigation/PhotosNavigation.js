/* @flow */
import { StackNavigator } from 'react-navigation'
import TextilePhotos from '../Containers/TextilePhotos'

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
      headerStyle: styles.header,
      title: "Photos"
    }
  }
)

export default PrimaryNav
