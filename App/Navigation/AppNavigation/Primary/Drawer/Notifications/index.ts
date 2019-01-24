import { createStackNavigator } from 'react-navigation'

import Notifications from '../../../../../Containers/FeedList'

import styles, { headerTintColor } from '../../../../Styles/NavigationStyles'

const nav = createStackNavigator(
  {
    Notifications
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
