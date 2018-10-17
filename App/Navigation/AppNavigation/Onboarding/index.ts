import { createStackNavigator } from 'react-navigation'

import OnboardingScreen from '../../../SB/views/OnBoarding'
import SignUpScreen from '../../../SB/views/SignUp/SignUpContainer'
import SignInScreen from '../../../SB/views/SignIn/SignInContainer'
import ProfilePicScreen from '../../../SB/views/UserOnBoarding/UserOnBoardingContainer'

const nav = createStackNavigator(
  {
    Onboarding: OnboardingScreen,
    SignUp: SignUpScreen,
    SignIn: SignInScreen,
    ProfilePic: ProfilePicScreen
  },
  {
    headerMode: 'none',
    navigationOptions: {
      gesturesEnabled: false
    }
  }
)

export default nav
