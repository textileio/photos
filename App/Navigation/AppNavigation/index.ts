import { createAppContainer, createStackNavigator } from 'react-navigation'

import SwitchNav from './Switch'
import Settings from './Settings'

const nav = createStackNavigator(
  {
    SwitchNav,
    Settings
  },
  {
    initialRouteName: 'SwitchNav',
    mode: 'modal',
    headerMode: 'none'
  }
)

const app = createAppContainer(nav)

export default app
