import { createSwitchNavigator } from 'react-navigation'

import StatusCheck from '../../../Containers/StatusCheck'
import Initialize from '../../../screens/initialize'
import PrimaryNav from './Primary'

const nav = createSwitchNavigator(
  {
    StatusCheck,
    Initialize,
    PrimaryNav
  },
  {
    initialRouteName: 'StatusCheck'
  }
)

export default nav
