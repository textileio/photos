import { createAppContainer, createStackNavigator } from 'react-navigation'

import SwitchNav from './Switch'
import Settings from './Settings'
import OnboardingNew from '../../screens/onboarding/onboarding-new'
import OnboardingExisting from '../../screens/onboarding/onboarding-existing'

const nav = createStackNavigator(
  {
    SwitchNav,
    Settings,
    OnboardingNew: {
      screen: OnboardingNew,
      navigationOptions: {
        gesturesEnabled: false
      }
    },
    OnboardingExisting: {
      screen: OnboardingExisting,
      navigationOptions: {
        gesturesEnabled: false
      }
    }
  },
  {
    initialRouteName: 'SwitchNav',
    mode: 'modal',
    headerMode: 'none'
  }
)

const app = createAppContainer(nav)

export default app
