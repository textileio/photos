// @ts-ignore
import { createBottomTabNavigator, createDrawerNavigator } from 'react-navigation'
import React from 'react'
import { Dimensions } from 'react-native'
import Icon from '../../../../Components/Icon'
import Wallet from './Wallet'
import Threads from './Threads'
import Notifications from './Notifications'
import Colors from '../../../../Themes/Colors'
import Drawer from '../../../../Containers/Drawer'
import * as s from '../../../../Themes/Constants'

import styles, { headerTintColor } from '../../../Styles/NavigationStyles'

const drawer = createDrawerNavigator(
  {
    Wallet,
    Threads,
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
