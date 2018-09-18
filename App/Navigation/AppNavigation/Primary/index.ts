import { createStackNavigator } from 'react-navigation'

import TabNavigator from './TabNavigator'
import Account from '../../../SB/views/UserProfile'
import NotificationSettings from '../../../SB/views/Notifications'
import Storage from '../../../SB/views/Storage'
import Mnemonic from '../../../SB/views/UserProfile/Mnemonic'
import UpdateAvatar from '../../../SB/views/UserOnBoarding/UpdateAvatar'

import styles, { headerTintColor } from '../../Styles/NavigationStyles'

const nav = createStackNavigator(
  {
    TabNavigator,
    Account,
    NotificationSettings,
    Storage,
    Mnemonic,
    ChangeAvatar: UpdateAvatar
  },
  {
    navigationOptions: {
      headerStyle: styles.header,
      headerTitleStyle: styles.headerTitle,
      headerTintColor
    }
  }
)

export default nav
