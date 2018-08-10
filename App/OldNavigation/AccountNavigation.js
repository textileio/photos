import {StackNavigator} from 'react-navigation'
import styles, {headerTintColor} from './Styles/NavigationStyles'

import Account from '../SB/views/UserProfile'
import Settings from '../SB/views/Settings'

const AccountNavigation = StackNavigator(
  {
    Account: {
      screen: Account
    },
    Settings: {
      screen: Settings
    }
  },
  {
    // Default config for all screens
    headerMode: 'float',
    navigationOptions: {
      headerStyle: [styles.header, {
        height: 130,
        paddingHorizontal: 16
      }],
      headerTitleContainerStyle: styles.headerTitle,
      headerTintColor: headerTintColor
    }
  }
)

export default AccountNavigation
