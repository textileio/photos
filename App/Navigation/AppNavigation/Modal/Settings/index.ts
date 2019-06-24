import { createStackNavigator } from 'react-navigation'

import Account from '../../../../SB/views/UserProfile'
import NotificationSettings from '../../../../SB/views/Notifications'
import Cafes from '../../../../Containers/Cafes'
import Cafe from '../../../../Containers/Cafe'
import CafeSession from '../../../../screens/cafe-session'
import Storage from '../../../../SB/views/Storage'
import DeviceLogs from '../../../../SB/views/DeviceLogs'
import NodeLogsScreen from '../../../../Components/NodeLogsScreen'
import RecoveryPhrase from '../../../../SB/views/UserProfile/RecoveryPhrase'
import SetAvatar from '../../../../Containers/SetAvatar'

import styles, { headerTintColor } from '../../../Styles/NavigationStyles'

const nav = createStackNavigator(
  {
    Account,
    NotificationSettings,
    Cafes,
    Cafe,
    CafeSession,
    Storage,
    RecoveryPhrase,
    ChangeAvatar: SetAvatar,
    DeviceLogs,
    NodeLogsScreen
  },
  {
    defaultNavigationOptions: {
      headerStyle: styles.header,
      headerTitleStyle: styles.headerTitle,
      headerTintColor
    }
  }
)

export default nav
