/* @flow */
import { StackNavigator } from 'react-navigation'
import OnboardingNavigation from './OnboardingNavigation'
import PhotosNavigation from './PhotosNavigation'

// Manifest of possible screens
const PrimaryNav = StackNavigator(
  {
    PhotosNavigation: {
      screen: PhotosNavigation
    },
    OnboardingNavigation: {
      screen: OnboardingNavigation
    },
  },
  {
    mode: 'modal',
    headerMode: 'none'
  }
)

export default PrimaryNav
