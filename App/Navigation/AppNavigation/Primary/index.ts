import { createStackNavigator } from 'react-navigation'

import TabNavigator from './TabNavigator'
import Account from './Account'

const nav = createStackNavigator(
  {
    TabNavigator: TabNavigator,
    Account: Account 
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
