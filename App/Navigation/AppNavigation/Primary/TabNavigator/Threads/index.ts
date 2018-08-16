import { createStackNavigator } from 'react-navigation'

import ThreadsList from '../../../../../Containers/ThreadsList'
import AddThreadScreen from '../../../../../Containers/AddThreadScreen'
import ThreadsDetail from '../../../../../SB/views/ThreadsDetail'
import ThreadPhotoDetail from '../../../../../SB/views/ThreadPhotoDetail'
import AddCaptionScreen from '../../../../../Containers/AddCaptionScreen'
import WalletPicker from '../../../../../Containers/WalletPicker'

import styles, { headerTintColor } from '../../../../Styles/NavigationStyles'

const nav = createStackNavigator(
  {
    SharedPhotos: ThreadsList,
    AddThread: AddThreadScreen,
    ViewThread: ThreadsDetail,
    PhotoViewer: ThreadPhotoDetail,
    ThreadSharePhoto: AddCaptionScreen,
    WalletPicker: WalletPicker
  },
  {
    headerMode: 'float',
    navigationOptions: {
      headerStyle: styles.header,
      headerTitleStyle: styles.headerTitle,
      headerTintColor: headerTintColor
    }
  }
)

export default nav
