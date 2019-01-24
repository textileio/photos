// @ts-ignore
import { createDrawerNavigator } from 'react-navigation'
import { Dimensions } from 'react-native'
import Contacts from './Contacts'
import Groups from './Groups'
import Notifications from './Notifications'
import Drawer from '../../../../../Containers/Drawer'
import * as s from '../../../../../Themes/Constants'

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
        fontFamily: s.FONT_FAMILY_REGULAR,
        fontWeight: 'normal',
        fontSize: s.FONT_SIZE_MEDIUM
      },
      activeLabelStyle: {
        color: s.COLOR_BRAND_BLUE
      }
    },
    navigationOptions: {
      // tslint:disable-next-line:no-null-keyword
      header: null
    }
  }
)

export default drawer
