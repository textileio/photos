/* @flow */
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { StackNavigator, TabNavigator, TabBarBottom } from 'react-navigation'
import PhotosNavigation from './PhotosNavigation'
import NewScreen from '../Containers/NewScreen'
import LaunchScreen from '../Containers/LaunchScreen'

import styles from './Styles/NavigationStyles'

const TabNav = TabNavigator(
  {
    PhotosNavigation: { screen: PhotosNavigation },
    NewScreen: { screen: NewScreen },
  },
  {
    navigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'PhotosNavigation') {
          iconName = `ios-photos${focused ? '' : '-outline'}`;
        } else if (routeName === 'NewScreen') {
          iconName = `ios-settings${focused ? '' : '-outline'}`;
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <Ionicons name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    },
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  }
);

export default TabNav
