import React from 'react'
import DismissableStackNavigator from '../Components/DismissableStackNavigator'
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation'
import { Image } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import TextilePhotos from '../Containers/TextilePhotos'
import InfoView from '../Containers/InfoView'
import PhotoViewerScreen from '../Containers/PhotoViewerScreen'
import Colors from '../Themes/Colors'
// import Notifications from '../Containers/Notifications'

// import SwipeNavigation from './SwipeNavigation'

import styles, {headerTintColor} from './Styles/NavigationStyles'
import Threads from '../Containers/Threads'
import AddThreadScreen from '../Containers/AddThreadScreen'

// BEGIN: SB Screens
import PhotoDetail from '../SB/views/PhotoDetail'
import ThreadPhotoDetail from '../SB/views/ThreadPhotoDetail'
import AddCaptionScreen from '../Containers/AddCaptionScreen'


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
      screen: TextilePhotos
    },
    PhotoViewer: {
      screen: ThreadPhotoDetail
    }
  },
  {
    // Default config for all screens
    headerMode: 'float',
    navigationOptions: {
      // headerStyle: styles.header,
      // headerTitleStyle: styles.headerTitle,
      // headerTintColor: headerTintColor,
      // headerBackTitleStyle: styles.headerButton
      headerStyle: styles.header,
      headerTitleContainerStyle: styles.headerTitle,
      headerTintColor: headerTintColor
    }
  }
)

const InfoNav = StackNavigator(
  {
    InfoView: InfoView
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
    InfoNav: { screen: InfoNav }
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
          } else if (routeName === 'InfoNav') {
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
    }
  },
  {
    mode: 'modal',
    headerMode: 'none',
    navigationOptions: {
      gesturesEnabled: false
    }
  }
)

export default RootStack
