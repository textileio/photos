/* @flow */
import { SwitchNavigator } from 'react-navigation'
import OnboardingNavigation from './OnboardingNavigation'
import PhotosNavigation from './PhotosNavigation'
import OnboardingCheck from '../Containers/OnboardingCheck'

const PrimaryNav = SwitchNavigator(
  {
    OnboardingCheck: {
      screen: OnboardingCheck
    },
    OnboardingNavigation: {
      screen: OnboardingNavigation
    },
    PhotosNavigation: {
      screen: PhotosNavigation
    }
  },
  {
    initialRouteName: 'OnboardingCheck'
  }
)

export default PrimaryNav
