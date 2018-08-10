import { createStackNavigator } from 'react-navigation'

import Account from '../../../../SB/views/UserProfile'
import Settings from '../../../../SB/views/Settings'

import styles, { headerTintColor } from '../../../Styles/NavigationStyles'

const nav = createStackNavigator(
  {
    About: Account,
    Settings: Settings
  },
  {
    headerMode: 'float',
    navigationOptions: {
      headerStyle: [styles.header, { height: 130, paddingHorizontal: 16 }],
      headerTitleStyle: styles.headerTitle,
      headerTintColor: headerTintColor
    }
  }
)

export default nav
