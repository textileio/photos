import { createAppContainer, createStackNavigator } from 'react-navigation'

import SwitchNav from './Switch'
import Settings from './Settings'
import OnboardingNew from '../../Containers/Onboarding/onboarding-new'
import OnboardingExisting from '../../Containers/Onboarding/onboarding-existing'

const nav = createStackNavigator(
  {
    SwitchNav,
    Settings,
    OnboardingNew,
    OnboardingExisting
  },
  {
    initialRouteName: 'SwitchNav',
    mode: 'modal',
    headerMode: 'none'
  }
)

const app = createAppContainer(nav)

export default app
