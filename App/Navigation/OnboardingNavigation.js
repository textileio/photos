import { StackNavigator } from 'react-navigation'
import OnboardingScreen from '../Containers/OnboardingScreen'
import {getPhoto} from '../Services/PhotoUtils'
import Actions from '../Redux/TextileRedux'
import styles from './Styles/NavigationStyles'

const params1 = {
  header: 'Welcome to the Textile Beta!',
  message: 'Thanks very much for agreeing to test the app and provide feedback on this very early draft of our brand new technology. Right now, Textile is all about photos, soon it will be about how you control and own all your personal data.',
  buttonTitle: 'OK',
  onButtonPress: (navigate) => {
    return () => {
      navigate('Onboarding1', params2)
    }
  }
}

const params2 = {
  header: 'Today we’re sharing our backup and sync tools.',
  message: 'While we don\'t recommend you delete your photos until our full release, right now you can use our system to upload backups of your private photos to decentralized servers around the world and then retrieve those photos at any time. You can also use our desktop tool to magically sync all your photos right to your computer.',
  buttonTitle: 'GOT IT',
  onButtonPress: (navigate) => {
    return () => {
      navigate('Onboarding2', params3)
    }
  }
}

const params3 = {
  header: 'We’ve got big plans…',
  message: 'We want to test out our infrastructure for moving, storing, and accessing private photos today. Next, we hope to provide you with some really exciting ways to share photos and interact with your friends and family on the same system. Beyond that, we want to give you secure tools to regain control over all your data.',
  buttonTitle: 'COOL',
  onButtonPress: (navigate) => {
    return () => {
      navigate('Onboarding3', params5)
    }
  }
}

const params5 = {
  header: 'Private, secure, fast, and distributed.',
  message: 'Right now, the Textile mobile app quietly listens for new photos you take with your camera. Next, it securely encrypts those photos in a way that only you (not even our servers) can ever open them. It then stores those files on servers using a system called, IPFS. All the while, it generates a private wallet that you can keep and eventually move to other systems where you keep control of all your data.',
  buttonTitle: 'OK',
  onButtonPress: (navigate) => {
    return () => {
      navigate('Onboarding4', params6)
    }
  }
}

const params6 = {
  header: 'You\'re helping us improve.',
  message: 'As valued Beta Tester, we want to know how, when, and why you are using the app. We anonymously collect data, including crashes, screen interactions, and feedback. If you want to provide direct feedback, please feel free to email us with you thoughts, comments, or ideas.',
  buttonTitle: 'GREAT',
  onButtonPress: (navigate) => {
    return () => {
      navigate('Onboarding5', params7)
    }
  }
}

const params7 = {
  header: 'Access your photos, anywhere.',
  message: 'In a few days, we will send you a link to download a desktop app that allows you to \'pair\' with this mobile app to automatically sync and save your photos to your desktop. This will allow you to take advantage of photo backup and storage, with zero external dependencies (you don’t even really need us)!',
  buttonTitle: 'SOUNDS GOOD',
  onButtonPress: (navigate) => {
    return () => {
      navigate('OnboardingPhotosPermissions', params8)
    }
  }
}

const params8 = {
  header: 'We need to access your photos.. surprise!',
  message: 'Please take a moment to authorize photo/camera access so we can privately back them up for you. But don\'t worry, they\'ll be encrypted and securely uploaded to protect your privacy.',
  buttonTitle: 'AUTHORIZE',
  onButtonPress: (navigate) => {
    return async () => {
      // Trigger photos permission prompt
      await getPhoto()
      navigate('OnboardingLocationPermissions', params9)
    }
  }
}

const params9 = {
  header: 'Location, location, location…',
  message: 'Please take a moment to authorize geolocation so we can use your location changes to wake up the app, making sure your photos are continuously backed up, even when you’re on the go.',
  buttonTitle: 'AUTHORIZE',
  onButtonPress: (navigate) => {
    return async () => {
      await navigator.geolocation.requestAuthorization()
      navigate('OnboardingThanks', params10)
    }
  }
}

const params10 = {
  header: 'You\'re ready!',
  message: 'We can’t wait for you to get started! So why not take a quick photo, and see what we’re all about. And if you’d like to learn more about our Beta program, please check out our website for details.',
  buttonTitle: 'GET STARTED',
  onButtonPress: (navigate, dispatch) => {
    return () => {
      dispatch(Actions.onboardedSuccess())
      navigate('PhotosNavigation')
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
    Onboarding1: {
      screen: OnboardingScreen,
      navigationOptions: {
        title: 'What is this?'
      }
    },
    Onboarding2: {
      screen: OnboardingScreen,
      navigationOptions: {
        title: 'What will it be?'
      }
    },
    Onboarding3: {
      screen: OnboardingScreen,
      navigationOptions: {
        title: 'How does it work?'
      }
    },
    Onboarding4: {
      screen: OnboardingScreen,
      navigationOptions: {
        title: 'Data Collection'
      }
    },
    Onboarding5: {
      screen: OnboardingScreen,
      navigationOptions: {
        title: 'Desktop Integration'
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
    }
  },
  {
    // Default config for all screens
    headerMode: 'float',
    left: null,
    initialRouteName: 'OnboardingScreen',
    initialRouteParams: params1,
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
