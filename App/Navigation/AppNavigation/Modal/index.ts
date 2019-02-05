import { createStackNavigator } from 'react-navigation'

import Primary from './Primary'
import AddContact from './AddContact'
import Settings from './Settings'

const nav = createStackNavigator(
  {
    Primary,
    AddContact,
    Settings
  },
  {
    mode: 'modal',
    headerMode: 'none'
  }
)

export default nav
