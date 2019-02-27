import { createStackNavigator } from 'react-navigation'

import Photos from '../../../../../../screens/camera-roll'

import styles, { headerTintColor } from '../../../../../Styles/NavigationStyles'

const nav = createStackNavigator(
  {
    Photos
  },
  {
    headerMode: 'float',
    defaultNavigationOptions: {
      headerStyle: styles.header,
      headerTitleStyle: styles.headerTitle,
      headerTintColor
    }
  }
)

export default nav
