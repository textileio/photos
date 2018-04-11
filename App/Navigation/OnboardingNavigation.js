import { createStackNavigator } from 'react-navigation'
import OnboardingWelcome from '../Containers/OnboardingWelcome'
import Onboarding1 from '../Containers/Onboarding1'
import Onboarding2 from '../Containers/Onboarding2'
import Onboarding3 from '../Containers/Onboarding3'
import Onboarding4 from '../Containers/Onboarding4'
import Onboarding5 from '../Containers/Onboarding5'
import OnboardingPhotosPermissions from '../Containers/OnboardingPhotosPermissions'
import OnboardingLocationPermissions from '../Containers/OnboardingLocationPermissions'
import OnboardingThanks from '../Containers/OnboardingThanks'
import styles from './Styles/NavigationStyles'

// Manifest of possible screens
const OnboardingNav = createStackNavigator(
  {
    OnboardingWelcome: {
      screen: OnboardingWelcome,
      navigationOptions: {
        title: 'Welcome'
      }
    },
    Onboarding1: {
      screen: Onboarding1,
      navigationOptions: {
        title: 'What is this?'
      }
    },
    Onboarding2: {
      screen: Onboarding2,
      navigationOptions: {
        title: 'What will it be?'
      }
    },
    Onboarding3: {
      screen: Onboarding3,
      navigationOptions: {
        title: 'How does it work?'
      }
    },
    Onboarding4: {
      screen: Onboarding4,
      navigationOptions: {
        title: 'Data Collection'
      }
    },
    Onboarding5: {
      screen: Onboarding5,
      navigationOptions: {
        title: 'Desktop Integration'
      }
    },
    OnboardingPhotosPermissions: {
      screen: OnboardingPhotosPermissions,
      navigationOptions: {
        title: 'Photo Permissions'
      }
    },
    OnboardingLocationPermissions: {
      screen: OnboardingLocationPermissions,
      navigationOptions: {
        title: 'Location Permissions'
      }
    },
    OnboardingThanks: {
      screen: OnboardingThanks,
      navigationOptions: {
        title: 'Thanks'
      }
    }
  },
  {
    // Default config for all screens
    headerMode: 'float',
    left: null,
    initialRouteName: 'OnboardingWelcome',
    navigationOptions: {
      headerStyle: styles.header,
      headerLeft: null,
      swipeEnabled: false,
      gesturesEnabled: false
    }
  }
)

export default OnboardingNav
