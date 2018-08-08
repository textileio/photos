import { SwitchNavigator } from 'react-navigation'
import OnboardingNavigation from './OnboardingNavigation'
import TextileManager from '../Containers/TextileManager'
import OnboardingCheck from '../Containers/OnboardingCheck'
import AndrewPairingInvite from '../SB/views/AndrewDeviceInvite'
import AndrewThreadInvite from '../SB/views/AndrewThreadInvite'
import AccountNavigation from './AccountNavigation'

const PrimaryNav = SwitchNavigator(
  {
    OnboardingCheck: OnboardingCheck,
    OnboardingNavigation: OnboardingNavigation,
    TextileManager: TextileManager,
    PairingView: {
      screen: AndrewPairingInvite
    },
    ThreadInvite: {
      screen: AndrewThreadInvite
    }
  },
  {
    initialRouteName: 'OnboardingCheck'
  }
)

export default PrimaryNav
