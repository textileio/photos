/* @flow */
import React from 'react'

// See options: http://evil-icons.io/
import EvilIcons from 'react-native-vector-icons/EvilIcons'
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
          iconName = `heart`;
        } else if (routeName === 'NewScreen') {
          iconName = `gear`;
        }
        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <EvilIcons name={iconName} size={25} color={tintColor} />;
      },
    }),
    tabBarOptions: {
      activeTintColor: '#F7F7F7',
      inactiveTintColor: '#F7F7F7',
      style: styles.tabStyle,
    },
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: false,
    swipeEnabled: false,
  }
);

export default TabNav
