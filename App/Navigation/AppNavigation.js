/* @flow */
import { SwitchNavigator } from 'react-navigation'
import OnboardingNavigation from './OnboardingNavigation'
import TextileManager from '../Containers/TextileManager'
import OnboardingCheck from '../Containers/OnboardingCheck'

const PrimaryNav = SwitchNavigator(
  {
    OnboardingCheck: OnboardingCheck,
    OnboardingNavigation: OnboardingNavigation,
    TextileManager: TextileManager
  },
  {
    initialRouteName: 'OnboardingCheck'
  }
)

export default PrimaryNav
