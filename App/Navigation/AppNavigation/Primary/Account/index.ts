import { createStackNavigator } from 'react-navigation'

import Account from '../../../../SB/views/UserProfile'
import Mnemonic from '../../../../SB/views/UserProfile/Mnemonic'
import Settings from '../../../../SB/views/Settings'
import UpdateAvatar from '../../../../SB/views/UserOnBoarding/UpdateAvatar'

import styles, { headerTintColor } from '../../../Styles/NavigationStyles'

const nav = createStackNavigator(
  {
    About: Account,
    Settings: Settings,
    Mnemonic: Mnemonic,
    ChangeAvatar: UpdateAvatar
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
