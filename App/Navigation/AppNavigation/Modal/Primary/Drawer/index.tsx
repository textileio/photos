import React from 'react'
import { createDrawerNavigator } from 'react-navigation'
import { Dimensions, Platform, Text, View, TextStyle } from 'react-native'
import Icon from '@textile/react-native-icon'
import Contacts from './Contacts'
import Groups from './Groups'
import Notifications from './Notifications'
import Photos from './Photos'
import Drawer from '../../../../../Containers/Drawer'
import { color, fontSize } from '../../../../../styles'
import NotificationsIcon from '../../../../../Components/NotificationsIcon';

export const NAVIGATOR_LABEL_STYLE: TextStyle = {
  fontFamily: 'Biotif-Medium',
  fontWeight: Platform.OS === 'ios' ? '600' : 'normal',
  fontSize: fontSize._18  
}
export const NAVIGATOR_ICON_SIZE = 24

const drawer = createDrawerNavigator(
  {
    Groups: {
      screen: Groups,
      navigationOptions: {
        drawerIcon: (
            <Icon name={'comment-text'} size={NAVIGATOR_ICON_SIZE} color={color.grey_3} />
          ),
      }, 
    },
    Contacts: {
      screen: Contacts,
      navigationOptions: {
        drawerIcon: (
            <Icon name={'laughing'} size={NAVIGATOR_ICON_SIZE} color={color.grey_3} />
          ),
      }, 
    },
    Photos: {
      screen: Photos,
      navigationOptions: {
        drawerIcon: (
            <Icon name={'image'} size={NAVIGATOR_ICON_SIZE} color={color.grey_3} />
          ),
      }, 
    },
    Notifications: {
      screen: Notifications,
      navigationOptions: {
        drawerIcon: (
            <NotificationsIcon name={'bell'} size={NAVIGATOR_ICON_SIZE} color={color.grey_3} alertColor={color.severe_4} />
          ),
      }, 
    }
  },
  {
    drawerType: 'slide',
    drawerWidth: Dimensions.get('screen').width - 40,
    contentComponent: Drawer,
    contentOptions: {
      labelStyle: NAVIGATOR_LABEL_STYLE,
      activeTintColor: color.action_3
    },
    navigationOptions: {
      // tslint:disable-next-line:no-null-keyword
      header: null
    }
  }
)

export default drawer
