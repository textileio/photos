// @ts-ignore
import { createDrawerNavigator } from 'react-navigation'
import { Dimensions, Platform } from 'react-native'
import Contacts from './Contacts'
import Groups from './Groups'
import Notifications from './Notifications'
import Drawer from '../../../../../Containers/Drawer'
import { color, fontSize } from '../../../../../styles'

import styles, { headerTintColor } from '../../../../Styles/NavigationStyles'

const drawer = createDrawerNavigator(
  {
    Groups,
    Contacts,
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
      activeLabelStyle: {
        color: color.action_3
      }
    },
    navigationOptions: {
      // tslint:disable-next-line:no-null-keyword
      header: null
    }
  }
)

export default drawer
