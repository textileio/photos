import { createStackNavigator } from 'react-navigation'

import OnboardingScreen from '../../../SB/views/OnBoarding'
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
    initialRouteName: 'MailListSignup',
    navigationOptions: {
      gesturesEnabled: false
    }
  }
)

export default nav
