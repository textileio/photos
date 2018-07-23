import { PermissionsAndroid, Platform, Linking, Text, View } from 'react-native'
import React from "react"
import { StackNavigator } from 'react-navigation'
import OnboardingScreen from '../SB/views/OnBoarding'
import SignUpScreen from '../SB/views/SignUp'
import { Colors } from '../Themes'
import SignInScreen from '../SB/views/SignIn'
import {getPage} from '../Services/PhotoUtils'
import Actions from '../Redux/TextileRedux'
import PreferencesActions from '../Redux/PreferencesRedux'
import styles from './Styles/NavigationStyles'
import ostyles, {buttonColor} from '../Containers/Styles/OnboardingScreenStyle'

// Manifest of possible screens
const OnboardingNav = StackNavigator(
  {
    Onboarding: {
      screen: OnboardingScreen
    },
    SignUp: {
      screen: SignUpScreen
    },
    SignIn: {
      screen: SignInScreen
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
