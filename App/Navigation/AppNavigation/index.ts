import { createSwitchNavigator } from 'react-navigation'

import OnboardingNavigation from './Onboarding'
import PrimaryNavigation from './Primary'

import OnboardingCheck from '../../Containers/OnboardingCheck'
import AndrewPairingInvite from '../../SB/views/AndrewDeviceInvite'
import AndrewThreadInvite from '../../SB/views/AndrewThreadInvite'

const nav = createSwitchNavigator(
  {
    OnboardingCheck: OnboardingCheck,
    OnboardingNavigation: OnboardingNavigation,
    PrimaryNavigation: PrimaryNavigation,
    PairingView: AndrewPairingInvite,
    ThreadInvite: AndrewThreadInvite
  },
  {
    initialRouteName: 'OnboardingCheck'
  }
)

export default nav
