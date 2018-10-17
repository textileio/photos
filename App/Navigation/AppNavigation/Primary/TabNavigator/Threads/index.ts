import { createStackNavigator } from 'react-navigation'

// @ts-ignore
import ThreadsList from '../../../../../Containers/ThreadsList'
// @ts-ignore
import ThreadsManager from '../../../../../Containers/ThreadsManager'
// @ts-ignore
import AddThreadScreen from '../../../../../Containers/AddThreadScreen'

// @ts-ignore
import styles, { headerTintColor } from '../../../../Styles/NavigationStyles'

const nav = createStackNavigator(
  {
    SharedPhotos: ThreadsList,
    AddThread: AddThreadScreen,
    ThreadsManager
  },
  {
    navigationOptions: {
      headerStyle: styles.header,
      headerTitleStyle: styles.headerTitle,
      headerTintColor
    }
  }
)

export default nav
