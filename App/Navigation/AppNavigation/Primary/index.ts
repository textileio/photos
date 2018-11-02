import { createStackNavigator } from 'react-navigation'

import TabNavigator from './TabNavigator'

import Account from '../../../SB/views/UserProfile'
import NotificationSettings from '../../../SB/views/Notifications'
import Storage from '../../../SB/views/Storage'
import DeviceLogs from '../../../SB/views/DeviceLogs'
import Mnemonic from '../../../SB/views/UserProfile/Mnemonic'
import UpdateAvatar from '../../../SB/views/UserOnBoarding/UpdateAvatar'

import ThreadDetail from '../../../SB/views/ThreadDetail'
import PhotoScreen from '../../../Containers/PhotoScreen'
import Comments from '../../../Containers/Comments'
import LikesScreen from '../../../Containers/LikesScreen'
import AddCaptionScreen from '../../../Containers/AddCaptionScreen'
import WalletPicker from '../../../Containers/WalletPicker'

import PairingView from '../../../SB/views/DevicePairingView'
import AcceptInviteScreen from '../../../Containers/AcceptInviteScreen'

import styles, { headerTintColor } from '../../Styles/NavigationStyles'

const nav = createStackNavigator(
  {
    TabNavigator,

    Account,
    NotificationSettings,
    Storage,
    Mnemonic,
    ChangeAvatar: UpdateAvatar,

    ViewThread: ThreadDetail,
    PhotoScreen,
    Comments,
    LikesScreen,
    ThreadSharePhoto: AddCaptionScreen,
    WalletPicker,

    PairingView,
    ThreadInvite: AcceptInviteScreen,

    DeviceLogs
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
