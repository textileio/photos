/* @flow */
import React from 'react'
import DismissableStackNavigator from '../Components/DismissableStackNavigator'
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation'
import Ionicons from 'react-native-vector-icons/Ionicons'
import TextilePhotos from '../Containers/TextilePhotos'
import InfoView from '../Containers/InfoView'
import PairingView from '../Containers/PairingView'
import PhotoViewerScreen from '../Containers/PhotoViewerScreen'
import Colors from '../Themes/Colors'
// import Notifications from '../Containers/Notifications'
import { Image } from 'react-native'

// import SwipeNavigation from './SwipeNavigation'

import styles, {headerTintColor} from './Styles/NavigationStyles'

// Manifest of possible screens

const PhotosNav = StackNavigator(
  {
    TextilePhotos: {
      screen: TextilePhotos,
      navigationOptions: {
        headerTitle: <Image style={styles.headerTitleImage} source={require('../Images/TextileHeader.png')} />
      }
    }
  },
  {
    // Default config for all screens
    headerMode: 'float',
    initialRouteParams: { thread: 'default', sharable: true },
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
      screen: TextilePhotos,
      navigationOptions: {
        headerTitle: 'Shared Photos'
      }
    }
  },
  {
    // Default config for all screens
    headerMode: 'float',
    initialRouteParams: { thread: 'beta', sharable: false },
    navigationOptions: {
      headerStyle: styles.header,
      headerTitleStyle: styles.headerTitle,
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
      let title
      if (routeName === 'PhotosNav') {
        title = 'Library'
      } else if (routeName === 'SharedPhotosNav') {
        title = 'Shared'
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

const PairingStackNav = DismissableStackNavigator(
  {
    Pairing: PairingView
  },
  {
    headerMode: 'float',
    navigationOptions: {
      headerStyle: styles.header,
      headerTitleStyle: styles.headerTitle,
      headerTintColor: headerTintColor
    }
  }
)

const RootStack = StackNavigator(
  {
    PrimaryNav: {
      screen: TabNav
    },
    PhotoViewer: {
      screen: PhotoViewerStack
    },
    PairingView: {
      screen: PairingStackNav
    }
  },
  {
    mode: 'modal',
    headerMode: 'none'
  }
)

export default RootStack
