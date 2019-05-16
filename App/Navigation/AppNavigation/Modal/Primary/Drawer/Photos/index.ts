import { createStackNavigator } from 'react-navigation'

import Photos from '../../../../../../screens/photos'

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
