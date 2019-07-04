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
import MailListSignupScreen from '../MailListSignupScreen'
import PreferencesActions from '../../Redux/PreferencesRedux'
import ChooseCafe from '../../Containers/ChooseCafe'
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

interface State {
  currentPage: number
}

class OnboardingScreen extends React.Component<Props, State> {
  pages?: any

  constructor(props: Props) {
    super(props)
    this.state = {
      currentPage: 0
    }
  }

  nextPage = () => {
    if (this.pages && this.state.currentPage < this.pages.length - 1) {
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

  pagesArray = () => {
    const pages = [
      <ReferralCode
        key="referral"
        targetReferralCode={Config.RN_TEMPORARY_REFERRAL}
        referralCode={this.props.referralCode}
        onSuccess={this.nextPage}
      />,
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
    ]
    return pages
  }

  displayProgressBar = () => {
    const displayProgressBar = [false, true, true, true, true, true]
    return displayProgressBar[this.state.currentPage]
  }

  render() {
    this.pages = this.pagesArray()
    return (
      <SafeAreaView style={CONTAINER}>
        <View style={CONTAINER}>
          <View style={[CONTAINER, { marginBottom: spacing._016 }]}>
            {this.pages[this.state.currentPage]}
          </View>
          {this.displayProgressBar() && (
            <ProgressBar
              length={this.pages.length}
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
