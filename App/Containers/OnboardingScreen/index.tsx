import React from 'react'
import { SafeAreaView, ViewStyle, View, TouchableOpacity } from 'react-native'
// @ts-ignore
import { Pages } from 'react-native-pages'
import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import Config from 'react-native-config'

import { COLOR_BACKGROUND_PRIMARY, COLOR_GREY_LIGHT, COLOR_BRAND_PINK, MARGIN_STANDARD, MARGIN_SMALL } from '../../Themes/Constants'
import OnboardingMessage from '../../Components/OnboardingMessage'
import ReferralCode from '../../Components/ReferralCode'
import OnboardingUsername from '../../Containers/OnboardingUsername'
import SetAvatar from '../../Containers/SetAvatar'
import MailListSignupScreen from '../MailListSignupScreen'
import Icon from '../../Components/Icon'
import PrefrencesActions from '../../Redux/PreferencesRedux'
import { RootAction, RootState } from '../../Redux/Types'

const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: COLOR_BACKGROUND_PRIMARY
}

const ARROW_FORWARD: ViewStyle = {
  position: 'absolute',
  bottom: MARGIN_SMALL,
  right: MARGIN_STANDARD,
  alignSelf: 'flex-end'
}

interface StateProps {
  migrationUsername?: string
  pendingMigration: boolean
  skipReferralCode: boolean
}

interface DispatchProps {
  complete: () => void
}

type Props = StateProps & DispatchProps & NavigationScreenProps

interface State {
  showArrow: boolean
  currentPage: number
}

class OnboardingScreen extends React.Component<Props, State> {

  pages?: Pages

  constructor(props: Props) {
    super(props)
    this.state = {
      showArrow: false,
      currentPage: 0
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
    if (this.pages && this.pages.props.children.length - 1 > this.state.currentPage) {
      this.pages.scrollToPage(this.state.currentPage + 1)
    }
  }

  onScrollEnd = (index: number) => {
    this.setState({
      showArrow: this.showArrowForIndex(index),
      currentPage: index
    })
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
        <OnboardingUsername
          key='username'
          onSuccess={this.nextPage}
          suggestion={this.props.migrationUsername}
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
    if (!this.props.skipReferralCode) {
      pages.splice(3, 0, (
        <ReferralCode
          key='referral'
          referralCode={Config.RN_TEMPORARY_REFERRAL}
          onSuccess={this.nextPage}
        />
      ))
    }
    if (this.props.pendingMigration) {
      pages.unshift((
        <OnboardingMessage
          key='migration'
          title='Big Changes Under the Hood'
          image={require('./statics/secure.png')}
          showArrow={true}
        >
          We're working fast to make Textile Photos even better.
          Your old data isn't compatible with this new version of the app,
          so you'll be starting fresh now. Check out your Notifications
          screen to get started migrating your old data if you'd like.
        </OnboardingMessage>
      ))
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
            containerStyle={{ marginBottom: MARGIN_SMALL }}
            indicatorColor={COLOR_BRAND_PINK}
            onScrollEnd={this.onScrollEnd}
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
  migrationUsername: state.migration.peerAnnouncement ? state.migration.peerAnnouncement.peerDetails.previousUsername : undefined,
  pendingMigration: state.migration.status === 'pending',
  // No need for a referral challenge if this was a previous install and we're migrating or the user received a thread invite and is getting set up
  skipReferralCode: state.migration.status === 'pending' || state.auth.invite !== undefined
})

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => ({
  complete: () => dispatch(PrefrencesActions.onboardedSuccess())
})

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingScreen)
