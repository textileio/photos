import { createStackNavigator } from 'react-navigation'

import OnboardingScreen from '../../../Containers/OnboardingScreen'
import MailListSignupSceen from '../../../Containers/MailListSignupScreen'
import SignUpScreen from '../../../SB/views/SignUp/SignUpContainer'
import SignInScreen from '../../../SB/views/SignIn/SignInContainer'
import ProfilePicScreen from '../../../SB/views/UserOnBoarding/UserOnBoardingContainer'

const nav = createStackNavigator(
  {
    Onboarding: OnboardingScreen,
    MailListSignup: MailListSignupSceen,
    SignUp: SignUpScreen,
    SignIn: SignInScreen,
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
