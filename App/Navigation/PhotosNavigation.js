import React from 'react'
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation'
import { Image } from 'react-native'
import TextilePhotos from '../Containers/TextilePhotos'

import styles, {headerTintColor} from './Styles/NavigationStyles'
import AccountNavigation from './AccountNavigation'
import Threads from '../Containers/Threads'
import AddThreadScreen from '../Containers/AddThreadScreen'


// BEGIN: SB Screens
import PhotoDetail from '../SB/views/PhotoDetail'
import Notifications from '../SB/views/FeedList'
import ThreadPhotoDetail from '../SB/views/ThreadPhotoDetail'
import ThreadsDetail from '../SB/views/ThreadsDetail'
import AddCaptionScreen from '../Containers/AddCaptionScreen'
import WalletPicker from '../Containers/WalletPicker'


// Manifest of possible screens
const PhotosNav = StackNavigator(
  {
    TextilePhotos: {
      screen: TextilePhotos
    },
    PhotoViewer: {
      screen: PhotoDetail
    },
    SharePhoto: {
      screen: AddCaptionScreen
    }
  },
  {
    // Default config for all screens
    headerMode: 'float',
    navigationOptions: {
      headerStyle: styles.header,
      headerTitleContainerStyle: styles.headerTitle,
      headerTintColor: headerTintColor
    }
  }
)

const SharedPhotosNav = StackNavigator(
  {
    SharedPhotos: {
      screen: Threads
    },
    AddThread: {
      screen: AddThreadScreen
    },
    ViewThread: {
      screen: ThreadsDetail
    },
    PhotoViewer: {
      screen: ThreadPhotoDetail
    },
    SharePhoto: {
      screen: AddCaptionScreen
    },
    WalletPicker: {
      screen: WalletPicker
    }
  },
  {
    // Default config for all screens
    headerMode: 'float',
    navigationOptions: {
      headerStyle: styles.header,
      headerTitleContainerStyle: styles.headerTitle,
      headerTintColor: headerTintColor
    }
  }
)

const NotificationsNav = StackNavigator(
  {
    Notifications: Notifications
  },
  {
    // Default config for all screens
    headerMode: 'float',
    navigationOptions: {
      headerStyle: styles.header,
      headerTitleStyle: styles.headerTitle,
      headerTintColor: headerTintColor
    }
  }
)

const TabNav = TabNavigator(
  {
    PhotosNav: { screen: PhotosNav },
    SharedPhotosNav: { screen: SharedPhotosNav },
    NotificationsNav: { screen: NotificationsNav }
  },
  {
    navigationOptions: ({ navigation }) => {
      const {routeName} = navigation.state
      return {
        tabBarIcon: ({focused, tintColor}) => {
          let icon
          if (routeName === 'PhotosNav') {
            icon = focused ? require('../SB/components/BottomBar/statics/icon-wallet-active.png') : require('../SB/components/BottomBar/statics/icon-wallet.png')
          } else if (routeName === 'SharedPhotosNav') {
            icon = focused ? require('../SB/components/BottomBar/statics/icon-threads-active.png') : require('../SB/components/BottomBar/statics/icon-threads.png')
          } else if (routeName === 'NotificationsNav') {
            icon = focused ? require('../SB/components/BottomBar/statics/icon-feed-active.png') : require('../SB/components/BottomBar/statics/icon-feed.png')
          }
          return <Image style={styles.bottomBarIcon} source={icon} />
        }
      }
    },
    tabBarOptions: {
      showLabel: false,
      style: styles.bottomBar
    },
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  }
)

const RootStack = StackNavigator(
  {
    PrimaryNav: {
      screen: TabNav
    },
    Account: {
      screen: AccountNavigation
    }
  },
  {
    mode: 'card',
    headerMode: 'none',
    navigationOptions: {
      gesturesEnabled: false
    }
  }
)

export default RootStack
