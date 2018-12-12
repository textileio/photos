import { createSwitchNavigator } from 'react-navigation'

import OnboardingNavigation from './Onboarding'
import PrimaryNavigation from './Primary'
import MigrationContainer from '../../Containers/MigrationContainer'

import StatusCheck from '../../Containers/StatusCheck'

const nav = createSwitchNavigator(
  {
    StatusCheck,
    OnboardingNavigation,
    Migration: MigrationContainer,
    PrimaryNavigation
  },
  {
    initialRouteName: 'StatusCheck'
  }
)

export default nav
