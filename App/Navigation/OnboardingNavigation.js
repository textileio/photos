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
    OnboardingSecurity: { screen: OnboardingSecurity },
    OnboardingAccess: { screen: OnboardingAccess },
    OnboardingShare: { screen: OnboardingShare },
    OnboardingBetaWelcome: { screen: OnboardingBetaWelcome },
    OnboardingPermissions: { screen: OnboardingPermissions },
  },
  {
    // Default config for all screens
    headerMode: 'float',
    initialRouteName: 'OnboardingSecurity',
    navigationOptions: {
      headerStyle: styles.header,
      title: 'Welcome'
    }
  }
)

export default OnboardingNav
