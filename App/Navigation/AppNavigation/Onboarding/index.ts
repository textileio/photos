import { createStackNavigator } from 'react-navigation'

// @ts-ignore
import OnboardingScreen from '../../../SB/views/OnBoarding'
// @ts-ignore
import SignUpScreen from '../../../SB/views/SignUp/SignUpContainer'
// @ts-ignore
import SignInScreen from '../../../SB/views/SignIn/SignInContainer'
// @ts-ignore
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
