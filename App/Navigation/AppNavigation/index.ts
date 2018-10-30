import { createSwitchNavigator } from 'react-navigation'

import OnboardingNavigation from './Onboarding'
import MigrationNavigation from './Migration'
import PrimaryNavigation from './Primary'

import StatusCheck from '../../Containers/StatusCheck'

const nav = createSwitchNavigator(
  {
    StatusCheck,
    OnboardingNavigation,
    MigrationNavigation,
    PrimaryNavigation
  },
  {
    initialRouteName: 'StatusCheck'
  }
)

export default nav
