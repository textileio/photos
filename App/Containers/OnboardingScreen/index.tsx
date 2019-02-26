import React from 'react'
import { SafeAreaView, ViewStyle, View, TouchableOpacity } from 'react-native'
import { Pages } from 'react-native-pages'
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
import PrefrencesActions from '../../Redux/PreferencesRedux'
import { RootAction, RootState } from '../../Redux/Types'
import { color, spacing } from '../../styles'

const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: color.screen_primary
}

const ARROW_FORWARD: ViewStyle = {
  position: 'absolute',
  bottom: spacing._016,
  right: spacing._016,
  alignSelf: 'flex-end'
}

interface StateProps {
  skipReferralCode: boolean
}

interface DispatchProps {
  complete: () => void
}

type Props = StateProps & DispatchProps & NavigationScreenProps

interface State {
  blockNext: boolean
  showArrow: boolean
  currentPage: number
}

class OnboardingScreen extends React.Component<Props, State> {

  pages?: any

  constructor(props: Props) {
    super(props)
    this.state = {
      showArrow: false,
      currentPage: 0,
      blockNext: false
    }
  }

  componentDidMount() {
    this.setState({
      showArrow: this.showArrowForIndex(0)
    })
  }

  showArrowForIndex = (index: number) => {
    if (!this.pages || !this.pages.props.children[index]) {
      return false
    }
    const showArrow = this.pages.props.children[index].props.showArrow
    return showArrow
  }

  nextPage = () => {
    if (this.pages && this.pages.props.children.length - 1 > this.state.currentPage && !this.state.blockNext) {
      this.setState({blockNext: true})
      this.pages.scrollToPage(this.state.currentPage + 1)
      setTimeout(() => {
        this.setState({
          blockNext: false,
          showArrow: this.showArrowForIndex(this.state.currentPage + 1),
          currentPage: this.state.currentPage + 1
        })
      }, 350)
    }
  }

  complete = () => {
    this.props.complete()
    this.props.navigation.navigate('StatusCheck')
  }

  pagesArray = () => {
    const pages = [
      (
        <OnboardingMessage
          key='own'
          title='Own your memories'
          subtitle='Your data is stored in a decentralized system to bring you full ownership of your photos.'
          image={require('./statics/secure.png')}
          showArrow={true}
        />
      ),
      (
        <OnboardingMessage
          key='better'
          title='Better together'
          subtitle='Create private threads to share your photos with friends and family.'
          image={require('./statics/share.png')}
          showArrow={true}
        />
      ),
      (
        <OnboardingMessage
          key='backed'
          title='Backed up safely'
          subtitle='Everytime you take a picture, Textile will be there to automatically sync your photos.'
          image={require('./statics/sync.png')}
          showArrow={true}
        />
      ),
      (
        <ReferralCode
          key='referral'
          referralCode={Config.RN_TEMPORARY_REFERRAL}
          onSuccess={this.nextPage}
        />
      ),
      (
        <OnboardingUsername
          key='username'
          onSuccess={this.nextPage}
        />
      ),
      (
        <SetAvatar key='avatar' onSuccess={this.nextPage} />
      ),
      (
        <MailListSignupScreen key='mail' onSuccess={this.nextPage} />
      ),
      (
        <OnboardingMessage
          key='ready'
          title='All ready!'
          subtitle="You're all set up. Enjoy using Textile :)"
          image={require('./statics/sync.png')}
          buttonText='Get Started'
          onButtonPress={this.complete}
        />
      )
    ]
    // remove referral code if needed.
    if (this.props.skipReferralCode) {
      pages.splice(3, 1)
    }
    return pages
  }

  render() {
    const pages = this.pagesArray()
    return (
      <SafeAreaView style={CONTAINER}>
        <View style={CONTAINER}>
          <Pages
            ref={(pages: any) => { this.pages = pages ? pages : undefined }}
            style={[CONTAINER]}
            containerStyle={{ marginBottom: spacing._016 }}
            indicatorColor={color.accent2_2}
            startPage={this.state.currentPage}
            scrollEnabled={false}
          >
            {pages}
          </Pages>
          {this.state.showArrow &&
            <TouchableOpacity hitSlop={{ top: 10, left: 10, bottom: 10, right: 10}} style={ARROW_FORWARD} onPress={this.nextPage}>
              <Icon name={'arrow-right'} size={24} />
            </TouchableOpacity>
          }
        </View>
      </SafeAreaView>
    )
  }
}

const mapStateToProps = (state: RootState): StateProps => ({
  // No need for a referral challenge if the user received a thread invite and is getting set up
  skipReferralCode: state.auth.invite !== undefined && state.auth.invite.referral !== undefined
})

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => ({
  complete: () => dispatch(PrefrencesActions.onboardingSuccess())
})

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingScreen)
