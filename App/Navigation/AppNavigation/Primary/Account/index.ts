import { createStackNavigator } from 'react-navigation'

import Account from '../../../../SB/views/UserProfile'
import Mnemonic from '../../../../SB/views/UserProfile/Mnemonic'
import Notifications from '../../../../SB/views/Notifications'
import Storage from '../../../../SB/views/Storage'
import UpdateAvatar from '../../../../SB/views/UserOnBoarding/UpdateAvatar'

import styles, { headerTintColor } from '../../../Styles/NavigationStyles'

const nav = createStackNavigator(
  {
    About: Account,
    Notifications,
    Storage,
    Mnemonic,
    ChangeAvatar: UpdateAvatar
  },
  {
    headerMode: 'float',
    navigationOptions: {
      headerStyle: styles.header,
      headerTitleStyle: styles.headerTitle,
      headerTintColor
    }
  }
)

export default nav
