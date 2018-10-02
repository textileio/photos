import { createSwitchNavigator } from 'react-navigation'

import OnboardingNavigation from './Onboarding'
import PrimaryNavigation from './Primary'

import OnboardingCheck from '../../Containers/OnboardingCheck'

const nav = createSwitchNavigator(
  {
    OnboardingCheck,
    OnboardingNavigation,
    PrimaryNavigation
  },
  {
    initialRouteName: 'OnboardingCheck'
  }
)

export default nav
