import { StackNavigator } from 'react-navigation'
import OnboardingScreen from '../SB/views/OnBoarding'
import SignUpScreen from '../SB/views/SignUp/SignUpContainer'
import SignInScreen from '../SB/views/SignIn/SignInContainer'
import PermissionsScreen from '../SB/views/SyncPermissions'
import ProfilePicScreen from '../SB/views/UserOnBoarding/UserOnBoardingContainer'

// Manifest of possible screens
const OnboardingNav = StackNavigator(
  {
    Onboarding: OnboardingScreen,
    SignUp: SignUpScreen,
    SignIn: SignInScreen,
    Permissions: PermissionsScreen,
    ProfilePic: ProfilePicScreen
  },
  {
    // Default config for all screens
    headerMode: 'none',
    initialRouteName: 'Permissions',
    navigationOptions: {
      swipeEnabled: false,
      gesturesEnabled: false
    }
  }
)

export default OnboardingNav
