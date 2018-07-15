import { SwitchNavigator } from 'react-navigation'
import OnboardingNavigation from './OnboardingNavigation'
import TextileManager from '../Containers/TextileManager'
import OnboardingCheck from '../Containers/OnboardingCheck'
import PairingView from '../Containers/PairingView'
import ThreadInvite from '../Containers/ThreadInvite'

const PrimaryNav = SwitchNavigator(
  {
    OnboardingCheck: OnboardingCheck,
    OnboardingNavigation: OnboardingNavigation,
    TextileManager: TextileManager,
    PairingView: PairingView,
    ThreadInvite: ThreadInvite
  },
  {
    initialRouteName: 'OnboardingCheck'
  }
)

export default PrimaryNav
