import { PermissionsAndroid, Platform, Linking, Text, View } from 'react-native'
import React from "react"
import { StackNavigator } from 'react-navigation'
import OnboardingScreen from '../SB/views/OnBoarding'
import { Colors } from '../Themes'
import LoginScreen from '../Containers/LoginScreen'
import {getPage} from '../Services/PhotoUtils'
import PreferencesActions from '../Redux/PreferencesRedux'
import styles from './Styles/NavigationStyles'
import ostyles, {buttonColor} from '../Containers/Styles/OnboardingScreenStyle'

// Manifest of possible screens
const OnboardingNav = StackNavigator(
  {
    OnboardingScreen: OnboardingScreen,
    Login: {
      screen: LoginScreen
    }
  },
  {
    // Default config for all screens
    headerMode: 'none',
    initialRouteName: 'Onboarding',
    navigationOptions: {
      swipeEnabled: false,
      gesturesEnabled: false
    }
  }
)

export default OnboardingNav
