import { createStackNavigator } from 'react-navigation'

import BottomDrawerPhotos from '../SB/components/BottomDrawerPhotos'

import styles, { headerTintColor } from './Styles/NavigationStyles'

const nav = createStackNavigator(
  {
    ShareToThreadList: {
      screen: BottomDrawerPhotos,
      navigationOptions: {
        header: null
      }
    }
  },
  {
    headerMode: 'float',
    initialRouteName: 'ShareToThreadList',
    navigationOptions: {
      gesturesEnabled: false,
      headerStyle: styles.header,
      headerTitleStyle: styles.headerTitle,
      headerTintColor: headerTintColor
    }
  }
)

export default nav
