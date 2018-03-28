import StackNavigator from '../Components/DismissableStackNavigator'
import OnboardingSecurity from '../Containers/OnboardingSecurity'
import OnboardingAccess from '../Containers/OnboardingAccess'
import OnboardingShare from '../Containers/OnboardingShare'
import OnboardingBetaWelcome from '../Containers/OnboardingBetaWelcome'
import OnboardingPermissions from '../Containers/OnboardingPermissions'

import styles from './Styles/NavigationStyles'

// Manifest of possible screens
const OnboardingNav = StackNavigator(
  {
    OnboardingSecurity: {
      screen: OnboardingSecurity,
      navigationOptions: {
        title: "Backup",
      },
    },
    OnboardingAccess: {
      screen: OnboardingAccess,
      navigationOptions: {
        title: "Access",
      },
    },
    OnboardingShare: {
      screen: OnboardingShare,
      navigationOptions: {
        title: "Share",
      },
    },
    OnboardingBetaWelcome: {
      screen: OnboardingBetaWelcome,
      navigationOptions: {
        title: "Welcome",
      },
    },
    OnboardingPermissions: {
      screen: OnboardingPermissions,
      navigationOptions: {
        title: "Geolocation",
      },
    },
  },
  {
    // Default config for all screens
    headerMode: 'float',
    left: null,
    initialRouteName: 'OnboardingSecurity',
    navigationOptions: {
      headerStyle: styles.header,
      headerLeft: null,
      swipeEnabled: false,
      gesturesEnabled: false,
    }
  }
)

export default OnboardingNav
