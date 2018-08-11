import { createBottomTabNavigator } from 'react-navigation'
import React from 'react'
import { Image } from 'react-native'

import Wallet from './Wallet'
import Threads from './Threads'
import Notifications from './Notifications'

import styles, { headerTintColor } from '../../../Styles/NavigationStyles'

const nav = createBottomTabNavigator(
  {
    Wallet: Wallet,
    Threads: Threads,
    Notifications: Notifications
  },
  {
    navigationOptions: ({ navigation }) => {
      const { routeName } = navigation.state
      return {
        tabBarIcon: ({focused, tintColor}) => {
          let icon
          if (routeName === 'Wallet') {
            icon = focused ? require('../../../../SB/components/BottomBar/statics/icon-wallet-active.png') : require('../../../../SB/components/BottomBar/statics/icon-wallet.png')
          } else if (routeName === 'Threads') {
            icon = focused ? require('../../../../SB/components/BottomBar/statics/icon-threads-active.png') : require('../../../../SB/components/BottomBar/statics/icon-threads.png')
          } else if (routeName === 'Notifications') {
            icon = focused ? require('../../../../SB/components/BottomBar/statics/icon-feed-active.png') : require('../../../../SB/components/BottomBar/statics/icon-feed.png')
          }
          return <Image style={styles.bottomBarIcon} source={icon} />
        }
      }
    },
    tabBarOptions: {
      showLabel: false,
      style: styles.bottomBar
    },
    animationEnabled: false,
    swipeEnabled: false,
  }
)

export default nav
