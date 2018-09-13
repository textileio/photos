import { createStackNavigator } from 'react-navigation'

import ThreadsList from '../../../../../Containers/ThreadsList'
import AddThreadScreen from '../../../../../Containers/AddThreadScreen'
import ThreadDetail from '../../../../../SB/views/ThreadDetail'
import ThreadPhotoDetail from '../../../../../SB/views/ThreadPhotoDetail'
import ThreadsEditFriends from '../../../../../SB/views/ThreadsEditFriends'
import Comments from '../../../../../Containers/Comments'
import AddCaptionScreen from '../../../../../Containers/AddCaptionScreen'
import WalletPicker from '../../../../../Containers/WalletPicker'

import styles, { headerTintColor } from '../../../../Styles/NavigationStyles'

const nav = createStackNavigator(
  {
    SharedPhotos: ThreadsList,
    AddThread: AddThreadScreen,
    AddFriends: ThreadsEditFriends,
    ViewThread: ThreadDetail,
    Comments,
    ThreadSharePhoto: AddCaptionScreen,
    WalletPicker
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

nav.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true
  if (navigation.state.index > 0) {
    tabBarVisible = false
  }
  return {
    tabBarVisible
  }
}

export default nav
