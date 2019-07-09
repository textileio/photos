import { createAppContainer, createStackNavigator } from 'react-navigation'

import SwitchNav from './Switch'
import AddContact from './AddContact'
import Settings from './Settings'
import NewAccountOnboarding from '../../screens/obboarding/new-account'
import ExistingAccountOnboarding from '../../screens/obboarding/existing-account'

const nav = createStackNavigator(
  {
    SwitchNav,
    AddContact,
    Settings,
    NewAccountOnboarding,
    ExistingAccountOnboarding
  },
  {
    mode: 'modal',
    headerMode: 'none'
  }
)

const app = createAppContainer(nav)

export default app
