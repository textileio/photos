import React from 'react'
import { SafeAreaView, ViewStyle, View, TouchableOpacity } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import Config from 'react-native-config'

import OnboardingMessage from '../../Components/OnboardingMessage'
import ReferralCode from '../../Components/ReferralCode'
import OnboardingUsername from '../../Containers/OnboardingUsername'
import SetAvatar from '../../Containers/SetAvatar'
import MailListSignupScreen from '../../Containers/MailListSignupScreen'
import PreferencesActions from '../../Redux/PreferencesRedux'
import ChooseCafe from '../../Containers/ChooseCafe'
import AccountScreen from '../../Containers/AccountScreen'
import { RootAction, RootState } from '../../Redux/Types'
import { color, spacing } from '../../styles'

// Styles

const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: color.screen_primary
}

const PROGRESS_BAR: ViewStyle = {
  height: 60,
  width: '100%',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center'
}

const DOT: ViewStyle = {
  margin: 3,
  height: 8,
  width: 8,
  backgroundColor: color.action_6,
  borderRadius: 4
}

const DOT_ACTIVE: ViewStyle = {
  backgroundColor: color.action_4
}

// Components

// Individual dot displayed at bottom of screen. Is highlighted when active.
interface DotProps {
  active: boolean
}

const Dot = (props: DotProps) => {
  return <View style={[DOT, props.active && DOT_ACTIVE]} />
}

interface ProgressBarProps {
  length: number
  active: number
}

// List of dots displayed at the bottom of the screen as a progress bar
const ProgressBar = (props: ProgressBarProps) => {
  return (
    <View style={PROGRESS_BAR}>
      {[...Array(props.length).keys()].map(i => {
        return <Dot key={i} active={i === props.active} />
      })}
    </View>
  )
}

// Props & State

interface StateProps {
  referralCode?: string
}

interface DispatchProps {
  complete: () => void
}

type Props = StateProps & DispatchProps & NavigationScreenProps

// flowSelected is the onboarding flow the user selected
// it starts out undefined when the user hasn't chosen whether they are going to
// connect an existing account or create a new account
interface State {
  flowSelected?: string
  pages?: any
  currentPage: number
}

class OnboardingScreen extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    // pages are the onboarding pages the user must go through no matter what
    // flow they select. The last page in the list should call selectFlow and pass
    // in which onboarding flow the user has chosen
    this.state = {
      currentPage: 0,
      pages: [
        <ReferralCode
          key="referral"
          targetReferralCode={Config.RN_TEMPORARY_REFERRAL}
          referralCode={this.props.referralCode}
          onSuccess={this.nextPage}
        />,
        <AccountScreen
          key="account"
          onSuccess={(flow: string) => this.selectFlow(flow)}
        />
      ]
    }
  }

  nextPage = () => {
    if (this.state.currentPage < this.state.pages.length - 1) {
      this.setState(prevState => {
        return {
          currentPage: prevState.currentPage + 1
        }
      })
    }
  }

  complete = () => {
    this.props.complete()
    this.props.navigation.navigate('StatusCheck')
  }

  selectFlow = (flow: string) => {
    // The "flow" is the onboarding path the user selects, identified by a string
    // That string is indexed into a map (string->list of pages) to start the onboarding
    const pages: {
      [index: string]: JSX.Element[]
    } = {
      newAccount: [
        <ChooseCafe key="cafe" onSuccess={this.nextPage} />,
        <OnboardingUsername key="username" onSuccess={this.nextPage} />,
        <SetAvatar key="avatar" onSuccess={this.nextPage} />,
        <MailListSignupScreen key="mail" onSuccess={this.nextPage} />,
        <OnboardingMessage
          key="ready"
          title="All ready!"
          subtitle="You're all set up. Enjoy using Textile :)"
          image={require('./statics/sync.png')}
          buttonText="Get Started"
          onButtonPress={this.complete}
        />
      ],
      existingAccount: [
        <MailListSignupScreen key="mail" onSuccess={this.nextPage} />,
        <OnboardingMessage
          key="ready"
          title="All ready!"
          subtitle="You're all set up. Enjoy using Textile :)"
          image={require('./statics/sync.png')}
          buttonText="Get Started"
          onButtonPress={this.complete}
        />
      ]
    }
    this.setState({
      currentPage: 0,
      pages: pages[flow]
    })
  }

  render() {
    return (
      <SafeAreaView style={CONTAINER}>
        <View style={CONTAINER}>
          <View style={[CONTAINER, { marginBottom: spacing._016 }]}>
            {this.state.pages[this.state.currentPage]}
          </View>
          {this.state.flowSelected && (
            <ProgressBar
              length={this.state.pages.length}
              active={this.state.currentPage}
            />
          )}
        </View>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state: RootState): StateProps => ({
  referralCode:
    state.auth.invite !== undefined ? state.auth.invite.referral : undefined
})

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => ({
  complete: () => dispatch(PreferencesActions.onboardingSuccess())
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OnboardingScreen)
