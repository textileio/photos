/* @flow */
import { StackNavigator } from 'react-navigation'
import OnboardingScreen from '../Containers/OnboardingScreen'
import TabNavigation from './TabNavigation'

// Manifest of possible screens
const PrimaryNav = StackNavigator(
  {
    TabNavigation: {
      screen: TabNavigation
    },
    OnboardingScreen: {
      screen: OnboardingScreen
    }
  },
  {
    mode: 'modal',
    headerMode: 'none'
  }
)

export default PrimaryNav
