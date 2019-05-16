import { createDrawerNavigator } from 'react-navigation'
import { Dimensions, Platform } from 'react-native'
import Contacts from './Contacts'
import Groups from './Groups'
import Notifications from './Notifications'
import Photos from './Photos'
import Drawer from '../../../../../Containers/Drawer'
import { color, fontSize } from '../../../../../styles'

const drawer = createDrawerNavigator(
  {
    Groups,
    Contacts,
    Photos,
    Notifications
  },
  {
    drawerType: 'slide',
    drawerWidth: Dimensions.get('screen').width - 40,
    contentComponent: Drawer,
    contentOptions: {
      labelStyle: {
        fontFamily: 'Biotif-Medium',
        fontWeight: Platform.OS === 'ios' ? '600' : 'normal',
        fontSize: fontSize._18
      },
      activeTintColor: color.action_3
    },
    navigationOptions: {
      // tslint:disable-next-line:no-null-keyword
      header: null
    }
  }
)

export default drawer
