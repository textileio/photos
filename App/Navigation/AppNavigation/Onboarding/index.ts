import { createStackNavigator } from 'react-navigation'

import OnboardingScreen from '../../../Containers/OnboardingScreen'

const nav = createStackNavigator(
  {
    Onboarding: OnboardingScreen
  },
  {
    headerMode: 'none',
    initialRouteName: 'Onboarding',
    defaultNavigationOptions: {
      gesturesEnabled: false
    }
  }
)

export default nav
