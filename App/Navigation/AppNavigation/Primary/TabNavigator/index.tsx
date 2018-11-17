import { createBottomTabNavigator } from 'react-navigation'
import React from 'react'
import Icons from '../../../../Components/Icons'
import Wallet from './Wallet'
import Threads from './Threads'
import Notifications from './Notifications'
import Colors from '../../../../Themes/Colors'

import styles, { headerTintColor } from '../../../Styles/NavigationStyles'

const nav = createBottomTabNavigator(
  {
    Wallet,
    Threads,
    Notifications
  },
  {
    navigationOptions: ({ navigation }) => {
      const { routeName } = navigation.state
      return {
        tabBarIcon: ({focused, tintColor}) => {
          let icon
          if (routeName === 'Wallet') {
            icon = 'user'
          } else if (routeName === 'Threads') {
            icon = 'grid-slides'
          } else {
            icon = 'bell'
          }
          const tint = tintColor || undefined
          return <Icons name={icon} size={24} color={tint} />
        }
      }
    },
    tabBarOptions: {
      showLabel: false,
      activeTintColor: Colors.brandBlue,
      inactiveTintColor: Colors.charcoal,
      style: styles.bottomBar
    },
    animationEnabled: false,
    swipeEnabled: false,
    initialRouteName: 'Threads'
  }
)

nav.navigationOptions = {
  // Hide the header from AppNavigator stack
  // tslint:disable-next-line:no-null-keyword
  header: null
}

export default nav
