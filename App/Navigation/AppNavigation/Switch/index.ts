import { createSwitchNavigator } from 'react-navigation'

import StatusCheck from '../../../Containers/StatusCheck'
import PrimaryNav from './Primary'

const nav = createSwitchNavigator(
  {
    StatusCheck,
    PrimaryNav
  },
  {
    initialRouteName: 'StatusCheck'
  }
)

export default nav
