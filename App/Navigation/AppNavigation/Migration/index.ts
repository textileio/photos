import { createStackNavigator } from 'react-navigation'
import MigrationScreen from '../../../Containers/MigrationScreen'

const nav = createStackNavigator(
  {
    MigrationScreen
  },
  {
    headerMode: 'float',
    navigationOptions: {
      gesturesEnabled: false
    }
  }
)

export default nav
