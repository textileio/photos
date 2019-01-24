// @ts-ignore
import { createStackNavigator } from 'react-navigation'

import BottomDrawerPhotos from '../SB/components/BottomDrawerPhotos'

import styles, { headerTintColor } from './Styles/NavigationStyles'

const nav = createStackNavigator(
  {
    ShareToThreadList: {
      screen: BottomDrawerPhotos,
      navigationOptions: {
        header: undefined
      }
    }
  },
  {
    headerMode: 'none',
    initialRouteName: 'ShareToThreadList',
    defaultNavigationOptions: {
      gesturesEnabled: false,
      headerStyle: styles.header,
      headerTitleStyle: styles.headerTitle,
      headerTintColor
    }
  }
)

export default nav
