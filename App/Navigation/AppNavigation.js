/* @flow */
import { StackNavigator } from 'react-navigation'
import OnboardingNavigation from './OnboardingNavigation'
import TabNavigation from './TabNavigation'

// Manifest of possible screens
const PrimaryNav = StackNavigator(
  {
    TabNavigation: {
      screen: TabNavigation
    },
    OnboardingNavigation: {
      screen: OnboardingNavigation
    }
  },
  {
    mode: 'modal',
    headerMode: 'none'
  }
)

export default PrimaryNav
