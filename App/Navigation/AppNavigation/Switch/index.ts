import { createSwitchNavigator } from 'react-navigation'

import StatusCheck from '../../../Containers/StatusCheck'
import Onboarding from '../../../Containers/Onboarding'
import PrimaryNav from './Primary'

const nav = createSwitchNavigator(
  {
    StatusCheck,
    Onboarding,
    PrimaryNav
  },
  {
    initialRouteName: 'StatusCheck'
  }
)

export default nav
