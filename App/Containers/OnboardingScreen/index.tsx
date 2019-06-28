import React from 'react'
import { SafeAreaView, ViewStyle, View, TouchableOpacity } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import Config from 'react-native-config'
import Icon from '@textile/react-native-icon'

import OnboardingMessage from '../../Components/OnboardingMessage'
import ReferralCode from '../../Components/ReferralCode'
import OnboardingUsername from '../../Containers/OnboardingUsername'
import SetAvatar from '../../Containers/SetAvatar'
import MailListSignupScreen from '../MailListSignupScreen'
import PreferencesActions from '../../Redux/PreferencesRedux'
import ChooseCafe from '../../Containers/ChooseCafe'
import { RootAction, RootState } from '../../Redux/Types'
import { color, spacing } from '../../styles'

const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: color.screen_primary
}

const DOT: ViewStyle = {
  margin: 3,
  height: 8,
  width: 8,
  backgroundColor: color.action_6,
  borderRadius: 4
}

const ARROW_FORWARD: ViewStyle = {
  position: 'absolute',
  bottom: spacing._016,
  right: spacing._016,
  alignSelf: 'flex-end'
}

interface StateProps {
  referralCode?: string
}

interface DispatchProps {
  complete: () => void
}

type Props = StateProps & DispatchProps & NavigationScreenProps

interface State {
  showArrow: boolean
  currentPage: number
  disableNext: boolean
}

class OnboardingScreen extends React.Component<Props, State> {
  pages?: any

  constructor(props: Props) {
    super(props)
    this.state = {
      showArrow: false,
      currentPage: 0,
      disableNext: false
    }
  }

  componentDidMount() {
    this.setState({
      showArrow: this.showArrowForIndex(0)
    })
  }

  showArrowForIndex = (index: number) => {
    return index <= 2
  }

  nextPage = () => {
    if (
      !this.state.disableNext &&
      this.pages &&
      this.state.currentPage < this.pages.length - 1
    ) {
      this.setState({
        showArrow: this.showArrowForIndex(this.state.currentPage + 1),
        currentPage: this.state.currentPage + 1,
        disableNext: true
      })
      setTimeout(() => {
        this.setState({ disableNext: false })
      }, 350)
    }
  }

  complete = () => {
    this.props.complete()
    this.props.navigation.navigate('StatusCheck')
  }

  pagesArray = () => {
    const pages = [
      <OnboardingMessage
        key="own"
        title="Own your memories"
        subtitle="Your data is stored in a decentralized system to bring you full ownership of your photos."
        image={require('./statics/secure.png')}
        showArrow={true}
      />,
      <OnboardingMessage
        key="better"
        title="Better together"
        subtitle="Create private threads to share your photos with friends and family."
        image={require('./statics/share.png')}
        showArrow={true}
      />,
      <OnboardingMessage
        key="backed"
        title="Backed up safely"
        subtitle="Everytime you take a picture, Textile will be there to automatically sync your photos."
        image={require('./statics/sync.png')}
        showArrow={true}
      />,
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

  render() {
    this.pages = this.pagesArray()
    return (
      <SafeAreaView style={CONTAINER}>
        <View style={CONTAINER}>
          <View style={[CONTAINER, { marginBottom: spacing._016 }]}>
            {this.pages[this.state.currentPage]}
          </View>
          {this.state.currentPage < 8 && (
            <View
              style={{
                height: 60,
                width: '100%',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <View
                style={[
                  DOT,
                  this.pages &&
                    this.state.currentPage === 0 && {
                      backgroundColor: color.action_4
                    }
                ]}
              />
              <View
                style={[
                  DOT,
                  this.pages &&
                    this.state.currentPage === 1 && {
                      backgroundColor: color.action_4
                    }
                ]}
              />
              <View
                style={[
                  DOT,
                  this.pages &&
                    this.state.currentPage === 2 && {
                      backgroundColor: color.action_4
                    }
                ]}
              />
              <View
                style={[
                  DOT,
                  this.pages &&
                    this.state.currentPage === 3 && {
                      backgroundColor: color.action_4
                    }
                ]}
              />
              <View
                style={[
                  DOT,
                  this.pages &&
                    this.state.currentPage === 4 && {
                      backgroundColor: color.action_4
                    }
                ]}
              />
              <View
                style={[
                  DOT,
                  this.pages &&
                    this.state.currentPage === 5 && {
                      backgroundColor: color.action_4
                    }
                ]}
              />
              <View
                style={[
                  DOT,
                  this.pages &&
                    this.state.currentPage === 6 && {
                      backgroundColor: color.action_4
                    }
                ]}
              />
              <View
                style={[
                  DOT,
                  this.pages &&
                    this.state.currentPage === 7 && {
                      backgroundColor: color.action_4
                    }
                ]}
              />
            </View>
          )}
          {this.state.showArrow && (
            <TouchableOpacity
              hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
              style={ARROW_FORWARD}
              onPress={this.nextPage}
            >
              <Icon name="arrow-right" size={24} />
            </TouchableOpacity>
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
