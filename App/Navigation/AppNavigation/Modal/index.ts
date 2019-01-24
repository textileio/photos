import { createStackNavigator } from 'react-navigation'

import Primary from './Primary'
import Settings from './Settings'

const nav = createStackNavigator(
  {
    Primary,
    Settings
  },
  {
    mode: 'modal',
    headerMode: 'none'
  }
)

export default nav
