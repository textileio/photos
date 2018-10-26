import { createStackNavigator } from 'react-navigation'

import ThreadsList from '../../../../../Containers/ThreadsList'
import ThreadsManager from '../../../../../Containers/ThreadsManager'

import styles, { headerTintColor } from '../../../../Styles/NavigationStyles'

const nav = createStackNavigator(
  {
    SharedPhotos: ThreadsList,
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
