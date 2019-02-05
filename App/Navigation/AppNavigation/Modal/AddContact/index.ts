import { createStackNavigator } from 'react-navigation'

import AddContact from '../../../../Containers/AddContact'
import Contact from '../../../../Containers/Contact'
import styles, { headerTintColor } from '../../../Styles/NavigationStyles'

const nav = createStackNavigator(
  {
    AddContact,
    Contact
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
