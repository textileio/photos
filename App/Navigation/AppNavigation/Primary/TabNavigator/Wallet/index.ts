import { createStackNavigator } from 'react-navigation'

// @ts-ignore
import Wallet from '../../../../../Containers/Wallet'
// @ts-ignore
import PrivatePhotoDetail from '../../../../../SB/views/PhotoDetail'
// @ts-ignore
import AddCaptionScreen from '../../../../../Containers/AddCaptionScreen'
// @ts-ignore
import AddThreadScreen from '../../../../../Containers/AddThreadScreen'

// @ts-ignore
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
