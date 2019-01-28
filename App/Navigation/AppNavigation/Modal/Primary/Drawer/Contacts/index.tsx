import { createStackNavigator } from 'react-navigation'

import Contacts from '../../../../../../Containers/Contacts'
import Contact from '../../../../../../Containers/Contact'

import styles, { headerTintColor } from '../../../../../Styles/NavigationStyles'

const nav = createStackNavigator(
  {
    Contacts,
    Contact
  },
  {
    headerMode: 'float',
    defaultNavigationOptions: {
      headerStyle: styles.header,
      headerTitleStyle: styles.headerTitle,
      headerTintColor
    }
  }
)

export default nav
