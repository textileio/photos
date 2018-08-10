import { createSwitchNavigator, createStackNavigator, createTabNavigator } from 'react-navigation'

import OnboardingCheck from '../Containers/OnboardingCheck'

import OnboardingScreen from '../SB/views/OnBoarding'
import SignUpScreen from '../SB/views/SignUp/SignUpContainer'
import SignInScreen from '../SB/views/SignIn/SignInContainer'
import ProfilePicScreen from '../SB/views/UserOnBoarding/UserOnBoardingContainer'

import Account from '../SB/views/UserProfile'
import Settings from '../SB/views/Settings'

import AndrewPairingInvite from '../SB/views/AndrewDeviceInvite'
import AndrewThreadInvite from '../SB/views/AndrewThreadInvite'

import styles, { headerTintColor } from './Styles/NavigationStyles'

const nav = createSwitchNavigator(
  {
    OnboardingCheck: OnboardingCheck,
    OnboardingNavigation: createStackNavigator(
      {
        Onboarding: OnboardingScreen,
        SignUp: SignUpScreen,
        SignIn: SignInScreen,
        ProfilePic: ProfilePicScreen
      },
      {
        headerMode: 'none',
        navigationOptions: {
          gesturesEnabled: false
        }
      }
    ),
    PhotosNavigation: createStackNavigator(
      {
        PrimaryNav: createTabNavigator(
          {
            
          }
        ),
        Account: createStackNavigator(
          {
            About: Account,
            Settings: Settings
          },
          {
            headerMode: 'float',
            navigationOptions: {
              headerStyle: [styles.header, { height: 130, paddingHorizontal: 16 }],
              headerTitleStyle: styles.headerTitle,
              headerTintColor: headerTintColor
            }
          }
        )
      },
      {
        mode: 'card',
        headerMode: 'none',
        navigationOptions: {
          gesturesEnabled: false
        }
      }
    ),
    PairingView: AndrewPairingInvite,
    ThreadInvite: AndrewThreadInvite
  },
  {
    initialRouteName: 'OnboardingCheck'
  }
)

export default nav
