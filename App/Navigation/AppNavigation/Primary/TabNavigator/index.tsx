import { createBottomTabNavigator } from 'react-navigation'
import React from 'react'
import Icons from '../../../../Components/Icons'
import Wallet from './Wallet'
import Threads from './Threads'
import Notifications from './Notifications'

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
            icon = 'home'
          } else if (routeName === 'Threads') {
            icon = 'threads'
          } else {
            icon = 'notifications'
          }
          const tint = tintColor || undefined
          return <Icons name={icon} size={25} color={tint} />
        }
      }
    },
    tabBarOptions: {
      showLabel: false,
      style: styles.bottomBar
    },
    animationEnabled: false,
    swipeEnabled: false,
    initialRouteName: 'Threads'
  }
)

nav.navigationOptions = {
  // Hide the header from AppNavigator stack
  header: null
}

export default nav
