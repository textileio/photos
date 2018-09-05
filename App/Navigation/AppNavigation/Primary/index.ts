import { createStackNavigator } from 'react-navigation'

import TabNavigator from './TabNavigator'
import Account from './Account'

const nav = createStackNavigator(
  {
    TabNavigator,
    Account
  },
  {
    mode: 'card',
    headerMode: 'none',
    navigationOptions: {
      gesturesEnabled: false
    }
  }
)

export default nav
