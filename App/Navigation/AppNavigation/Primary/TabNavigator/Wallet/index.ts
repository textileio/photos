import { createStackNavigator } from 'react-navigation'

import TextilePhotos from '../../../../../Containers/TextilePhotos'
import PhotoDetail from '../../../../../SB/views/PhotoDetail'
import AddCaptionScreen from '../../../../../Containers/AddCaptionScreen'
import AddThreadScreen from '../../../../../Containers/AddThreadScreen'

import styles, {headerTintColor} from '../../../../Styles/NavigationStyles'

const nav = createStackNavigator(
  {
    TextilePhotos: TextilePhotos,
    PhotoViewer: PhotoDetail,
    WalletSharePhoto: AddCaptionScreen,
    CreateThreadScreen: AddThreadScreen
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
