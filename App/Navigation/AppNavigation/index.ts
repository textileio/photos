import { createAppContainer, createStackNavigator } from 'react-navigation'

import SwitchNav from './Switch'
import Settings from './Settings'
import NewAccountOnboarding from '../../Containers/OnboardingScreen/new-account'
import ExistingAccountOnboarding from '../../Containers/OnboardingScreen/existing-account'

const nav = createStackNavigator(
  {
    SwitchNav,
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
