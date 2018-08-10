import { SwitchNavigator } from 'react-navigation'
import OnboardingNavigation from './OnboardingNavigation'
import PhotosNavigation from '../Navigation/PhotosNavigation'
import OnboardingCheck from '../Containers/OnboardingCheck'
import AndrewPairingInvite from '../SB/views/AndrewDeviceInvite'
import AndrewThreadInvite from '../SB/views/AndrewThreadInvite'

const PrimaryNav = SwitchNavigator(
  {
    OnboardingCheck: OnboardingCheck,
    OnboardingNavigation: OnboardingNavigation,
    PhotosNavigation: PhotosNavigation,
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
