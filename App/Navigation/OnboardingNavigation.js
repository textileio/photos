import { StackNavigator } from 'react-navigation'
import OnboardingScreen1 from '../Containers/OnboardingScreen1'
import OnboardingScreen2 from '../Containers/OnboardingScreen2'
import OnboardingScreen3 from '../Containers/OnboardingScreen3'

import styles from './Styles/NavigationStyles'

// Manifest of possible screens
const OnboardingNav = StackNavigator(
  {
    OnboardingScreen1: { screen: OnboardingScreen1 },
    OnboardingScreen2: { screen: OnboardingScreen2 },
    OnboardingScreen3: { screen: OnboardingScreen3 }
  },
  {
    // Default config for all screens
    headerMode: 'float',
    initialRouteName: 'OnboardingScreen1',
    navigationOptions: {
      headerStyle: styles.header,
      title: 'Welcome'
    }
  }
)

export default OnboardingNav
