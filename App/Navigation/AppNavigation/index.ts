import {
  createAppContainer,
  createSwitchNavigator
} from 'react-navigation'

import OnboardingNavigation from './Onboarding'
import ModalNavigation from './Modal'
import MigrationContainer from '../../Containers/MigrationContainer'

import StatusCheck from '../../Containers/StatusCheck'

const nav = createSwitchNavigator(
  {
    StatusCheck,
    OnboardingNavigation,
    Migration: MigrationContainer,
    ModalNavigation
  },
  {
    initialRouteName: 'StatusCheck'
  }
)

const app = createAppContainer(nav)

export default app
