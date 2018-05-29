import { PermissionsAndroid, Platform, Linking, Text, View } from 'react-native'
import React from "react"
import { StackNavigator } from 'react-navigation'
import OnboardingScreen from '../Containers/OnboardingScreen'
import { Colors } from '../Themes'
import LoginScreen from '../Containers/LoginScreen'
import {getPage} from '../Services/PhotoUtils'
import Actions from '../Redux/TextileRedux'
import styles from './Styles/NavigationStyles'
import ostyles, {buttonColor} from '../Containers/Styles/OnboardingScreenStyle'

export const params1 = {
  header: 'Welcome to the Textile!',
  message: (
    <View>
      <Text style={ostyles.message}>
      Before we get started, we wanted to let you know that we are collecting data in the Textile app. Your app usage can help us learn how people use the app.{'\n'}{'\n'}
      We collect anonymous data, including crashes, screen interactions, and feedback. All data is deleted within 60 days of collection.
      This data will help us improve our product.{'\n'}{'\n'}
      If you have any questions about this data collection process, please feel free to get in touch.
      </Text>
      <Text
        style={[ostyles.message, {color: Colors.brandBlue}]}
        onPress={() => Linking.openURL('https://github.com/textileio/textile-mobile/blob/master/TERMS.md')}>
        Terms of Service
      </Text>
    </View>
  ),
  buttonTitle: 'GREAT',
  onButtonPress: (navigate) => {
    return () => {
      navigate('OnboardingPhotosPermissions', params3)
    }
  }
}

const params3 = {
  header: 'We need to access your photos.. surprise!',
  message: <Text style={ostyles.message}>{`Please take a moment to authorize photo/camera access so we can privately back them up for you. But don't worry, they'll be encrypted and securely uploaded to protect your privacy.`}</Text>,
  buttonTitle: 'AUTHORIZE',
  onButtonPress: (navigate) => {
    return async () => {
      // Handle Android Permission
      if (Platform.OS === 'android') {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          'So you can take a photo and store it in Textile.'
        )
      }
      // Trigger photos permission prompt in iOS
      await getPage(1)
      navigate('OnboardingLocationPermissions', params4)
    }
  }
}

const params4 = {
  header: 'Location, location, location…',
  message: <Text style={ostyles.message}>{`Please take a moment to authorize geolocation. Be sure to select, ALWAYS ALLOW, so we can use your location changes to wake up the app, making sure your photos are continuously backed up, even when you’re on the go.`}</Text>,
  buttonTitle: 'AUTHORIZE',
  onButtonPress: (navigate) => {
    return async () => {
      // Handle Android Permission
      if (Platform.OS === 'android') {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          'So you can take a photo and store it in Textile.'
        )
      } else {
        await navigator.geolocation.requestAuthorization()
      }
      navigate('OnboardingThanks', params5)
    }
  }
}

const params5 = {
  header: 'You\'re ready!',
  message: <Text style={ostyles.message}>{`You are running on IPFS and the decentralized web, welcome to the future. Thank you for joining us for our early beta. We're excited to share these early steps with you and get your feedback along the way...`}</Text>,
  buttonTitle: 'GET STARTED',
  onButtonPress: (navigate, dispatch) => {
    return () => {
      dispatch(Actions.onboardedSuccess())
      navigate('TextileManager')
    }
  }
}

// Manifest of possible screens
const OnboardingNav = StackNavigator(
  {
    OnboardingScreen: {
      screen: OnboardingScreen,
      navigationOptions: {
        title: 'Welcome'
      }
    },
    OnboardingPhotosPermissions: {
      screen: OnboardingScreen,
      navigationOptions: {
        title: 'Photo Permissions'
      }
    },
    OnboardingLocationPermissions: {
      screen: OnboardingScreen,
      navigationOptions: {
        title: 'Location Permissions'
      }
    },
    OnboardingThanks: {
      screen: OnboardingScreen,
      navigationOptions: {
        title: 'Thanks'
      }
    },
    Login: {
      screen: LoginScreen
    }
  },
  {
    // Default config for all screens
    headerMode: 'float',
    left: null,
    initialRouteName: 'Login',
    initialRouteParams: {},
    navigationOptions: {
      headerStyle: styles.header,
      headerTitleStyle: styles.headerTitle,
      headerLeft: null,
      swipeEnabled: false,
      gesturesEnabled: false
    }
  }
)

export default OnboardingNav
