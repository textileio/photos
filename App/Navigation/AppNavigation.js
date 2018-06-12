/* @flow */
import { SwitchNavigator } from 'react-navigation'
import OnboardingNavigation from './OnboardingNavigation'
import TextileManager from '../Containers/TextileManager'
import OnboardingCheck from '../Containers/OnboardingCheck'
import PairingView from '../Containers/PairingView'

const PrimaryNav = SwitchNavigator(
  {
    OnboardingCheck: OnboardingCheck,
    OnboardingNavigation: OnboardingNavigation,
    TextileManager: TextileManager,
    PairingView: PairingView
  },
  {
    initialRouteName: 'OnboardingCheck'
  }
)

export default PrimaryNav
