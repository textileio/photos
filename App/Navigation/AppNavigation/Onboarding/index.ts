import { createStackNavigator } from 'react-navigation'

import OnboardingScreen from '../../../Containers/OnboardingScreen'
import ProfilePicScreen from '../../../SB/views/UserOnBoarding/UserOnBoardingContainer'

const nav = createStackNavigator(
  {
    Onboarding: OnboardingScreen,
    ProfilePic: ProfilePicScreen
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
