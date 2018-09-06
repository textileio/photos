import { createStackNavigator } from 'react-navigation'

import Wallet from '../../../../../Containers/Wallet'
import PrivatePhotoDetail from '../../../../../SB/views/PhotoDetail'
import AddCaptionScreen from '../../../../../Containers/AddCaptionScreen'
import AddThreadScreen from '../../../../../Containers/AddThreadScreen'

import styles, {headerTintColor} from '../../../../Styles/NavigationStyles'

const nav = createStackNavigator(
  {
    Wallet,
    PrivatePhotoDetail,
    WalletSharePhoto: AddCaptionScreen,
    CreateThreadScreen: AddThreadScreen
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
