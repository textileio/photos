import { StackNavigator } from 'react-navigation'

import BottomDrawerPhotos from '../SB/components/BottomDrawerPhotos'
import AddThreadScreen from '../Containers/AddThreadScreen'

import styles, {headerTintColor} from './Styles/NavigationStyles'

const nav = StackNavigator(
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
      swipeEnabled: false,
      gesturesEnabled: false,
      headerStyle: styles.header,
      headerTitleContainerStyle: styles.headerTitle,
      headerTintColor: headerTintColor
    }
  }
)

export default nav
