import { createStackNavigator } from 'react-navigation'

import BottomDrawerPhotos from '../SB/components/BottomDrawerPhotos'
import AddThreadScreen from '../Containers/AddThreadScreen'

import styles, { headerTintColor } from './Styles/NavigationStyles'

const nav = createStackNavigator(
  {
    ShareToThreadList: {
      screen: BottomDrawerPhotos,
      navigationOptions: {
        header: null
      }
    },
    AddThreadForShare: {
      screen: AddThreadScreen,
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
