import { StackNavigator } from 'react-navigation'
import OnboardingScreen from '../SB/views/OnBoarding'
import SignUpScreen from '../SB/views/SignUp/SignUpContainer'
import SignInScreen from '../SB/views/SignIn/SignInContainer'

// Manifest of possible screens
const OnboardingNav = StackNavigator(
  {
    Onboarding: OnboardingScreen,
    SignUp: SignUpScreen,
    SignIn: SignInScreen
  },
  {
    // Default config for all screens
    headerMode: 'none',
    initialRouteName: 'Onboarding',
    navigationOptions: {
      swipeEnabled: false,
      gesturesEnabled: false
    }
  }
)

export default OnboardingNav
