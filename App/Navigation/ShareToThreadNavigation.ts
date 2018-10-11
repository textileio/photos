import { createStackNavigator } from 'react-navigation'

// @ts-ignore
import BottomDrawerPhotos from '../SB/components/BottomDrawerPhotos'

// @ts-ignore
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
    navigationOptions: {
      gesturesEnabled: false,
      headerStyle: styles.header,
      headerTitleStyle: styles.headerTitle,
      headerTintColor
    }
  }
)

export default nav
