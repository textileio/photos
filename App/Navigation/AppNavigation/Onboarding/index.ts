import { createStackNavigator } from 'react-navigation'

import OnboardingScreen from '../../../Containers/OnboardingScreen'

const nav = createStackNavigator(
  {
    Onboarding: OnboardingScreen
  },
  {
    headerMode: 'none',
    initialRouteName: 'Onboarding',
    navigationOptions: {
      gesturesEnabled: false
    }
  }
)

export default nav
