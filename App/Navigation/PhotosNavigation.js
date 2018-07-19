import React from 'react'
import DismissableStackNavigator from '../Components/DismissableStackNavigator'
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation'
import Ionicons from 'react-native-vector-icons/Ionicons'
import TextilePhotos from '../Containers/TextilePhotos'
import InfoView from '../Containers/InfoView'
import PhotoViewerScreen from '../Containers/PhotoViewerScreen'
import Colors from '../Themes/Colors'
// import Notifications from '../Containers/Notifications'

// import SwipeNavigation from './SwipeNavigation'

import styles, {headerTintColor} from './Styles/NavigationStyles'
import Config from "react-native-config"
import Threads from '../Containers/Threads'
import AddThreadScreen from '../Containers/AddThreadScreen'

// Manifest of possible screens

const PhotosNav = StackNavigator(
  {
    TextilePhotos: {
      screen: TextilePhotos
    }
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
    }
  },
  {
    // Default config for all screens
    headerMode: 'float',
    navigationOptions: {
      headerStyle: styles.header,
      headerTitleStyle: styles.headerTitle,
      headerTintColor: headerTintColor,
      headerBackTitleStyle: styles.headerButton
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
      let title
      if (routeName === 'PhotosNav') {
        title = 'Wallet'
      } else if (routeName === 'SharedPhotosNav') {
        title = 'Threads'
      } else if (routeName === 'InfoNav') {
        title = 'Support'
      }
      return {
        tabBarIcon: ({focused, tintColor}) => {
          let iconName
          if (routeName === 'PhotosNav') {
            iconName = `ios-photos${focused ? '' : '-outline'}`
          } else if (routeName === 'SharedPhotosNav') {
            iconName = `ios-globe${focused ? '' : '-outline'}`
          } else if (routeName === 'InfoNav') {
            iconName = `ios-information-circle${focused ? '' : '-outline'}`
          }
          return <Ionicons name={iconName} size={25} color={tintColor} />
        },
        title: title
      }
    },
    tabBarOptions: {
      activeTintColor: Colors.brandRed
    },
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false
  }
)

const PhotoViewerStack = DismissableStackNavigator(
  {
    PhotoViewerScreen: {
      screen: PhotoViewerScreen
    }
  },
  {
    headerMode: 'none'
  }
)

const RootStack = StackNavigator(
  {
    PrimaryNav: {
      screen: TabNav
    },
    PhotoViewer: {
      screen: PhotoViewerStack
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
