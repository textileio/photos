import { createStackNavigator } from 'react-navigation'

import TabNavigator from './TabNavigator'

// @ts-ignore
import Account from '../../../SB/views/UserProfile'
// @ts-ignore
import NotificationSettings from '../../../SB/views/Notifications'
// @ts-ignore
import Storage from '../../../SB/views/Storage'
// @ts-ignore
import DeviceLogs from '../../../SB/views/DeviceLogs'
// @ts-ignore
import Mnemonic from '../../../SB/views/UserProfile/Mnemonic'
// @ts-ignore
import UpdateAvatar from '../../../SB/views/UserOnBoarding/UpdateAvatar'

// @ts-ignore
import ThreadDetail from '../../../SB/views/ThreadDetail'
// @ts-ignore
import ThreadsEditFriends from '../../../SB/views/ThreadsEditFriends'
// @ts-ignore
import PhotoScreen from '../../../Containers/PhotoScreen'
import Comments from '../../../Containers/Comments'
import LikesScreen from '../../../Containers/LikesScreen'
import AddCaptionScreen from '../../../Containers/AddCaptionScreen'
// @ts-ignore
import WalletPicker from '../../../Containers/WalletPicker'

// @ts-ignore
import PairingView from '../../../SB/views/DevicePairingView'
// @ts-ignore
import ThreadInvite from '../../../SB/views/ThreadInvite'

// @ts-ignore
import styles, { headerTintColor } from '../../Styles/NavigationStyles'

const nav = createStackNavigator(
  {
    TabNavigator,

    Account,
    NotificationSettings,
    Storage,
    Mnemonic,
    ChangeAvatar: UpdateAvatar,

    AddFriends: ThreadsEditFriends,
    ViewThread: ThreadDetail,
    PhotoScreen,
    Comments,
    LikesScreen,
    ThreadSharePhoto: AddCaptionScreen,
    WalletPicker,

    PairingView,
    ThreadInvite,

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
