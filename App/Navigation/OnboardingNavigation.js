import { PermissionsAndroid, Platform, Linking, Text, View } from 'react-native'
import React from "react"
import { StackNavigator } from 'react-navigation'
import OnboardingScreen from '../Containers/OnboardingScreen'
import { Colors } from '../Themes'
import LoginScreen from '../Containers/LoginScreen'
import {getPhoto} from '../Services/PhotoUtils'
import Actions from '../Redux/TextileRedux'
import styles from './Styles/NavigationStyles'
import ostyles, {buttonColor} from '../Containers/Styles/OnboardingScreenStyle'

export const params1 = {
  header: 'Welcome to the Textile Beta!',
  message: 'Thanks very much for agreeing to test the app and provide feedback on this very early draft of our brand new technology. Right now, Textile is all about photos, soon it will be about how you control and own all your personal data.',
  buttonTitle: 'OK',
  onButtonPress: (navigate) => {
    return () => {
      navigate('OnboardingInfo', params2)
    }
  }
}

const params2 = {
  header: 'You\'re helping us improve.',
  message: (
    <View>
      <Text style={ostyles.message}>
      As a valued Beta Tester, we want to know how, when, and why you are using the app.
      We anonymously collect data, including crashes, screen interactions, and feedback.
      This data will help us improve our product.
      If you have any questions about this data collection process, please feel free to get in touch, or check out our terms of service.
      </Text>
      <Text
        style={[ostyles.message, {color: Colors.brandBlue, paddingTop: 0}]}
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
  message: 'Please take a moment to authorize photo/camera access so we can privately back them up for you. But don\'t worry, they\'ll be encrypted and securely uploaded to protect your privacy.',
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
      await getPhoto()
      navigate('OnboardingLocationPermissions', params4)
    }
  }
}

const params4 = {
  header: 'Location, location, location…',
  message: 'Please take a moment to authorize geolocation. Be sure to select, ALWAYS ALLOW, so we can use your location changes to wake up the app, making sure your photos are continuously backed up, even when you’re on the go.',
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
  message: 'You are running on IPFS and the decentralized web, welcome to the future. Thank you for joining us for our early beta. We\'re excited to share these early steps with you and get your feedback along the way...',
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
    OnboardingInfo: {
      screen: OnboardingScreen,
      navigationOptions: {
        title: 'Data Collection'
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
