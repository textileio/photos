import React from 'react'
import { SafeAreaView, ViewStyle, View, TouchableOpacity } from 'react-native'
// @ts-ignore
import { Pages } from 'react-native-pages'
import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'

import { COLOR_BACKGROUND_PRIMARY, COLOR_GREY_LIGHT, COLOR_BRAND_PINK, MARGIN_STANDARD, MARGIN_SMALL } from '../../Themes/Constants'
import OnboardingMessage from '../../Components/OnboardingMessage'
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

const ARROW_BACK: ViewStyle = {
  position: 'absolute',
  bottom: MARGIN_SMALL,
  left: MARGIN_STANDARD
}

const ARROW_FORWARD: ViewStyle = {
  position: 'absolute',
  bottom: MARGIN_SMALL,
  right: MARGIN_STANDARD,
  alignSelf: 'flex-end'
}

interface StateProps {
  migrationUsername: string
  pendingMigration: boolean
}

interface DispatchProps {
  complete: () => void
}

type Props = StateProps & DispatchProps & NavigationScreenProps

interface State {
  currentPage: number
}

class OnboardingScreen extends React.Component<Props, State> {

  pages?: Pages
  noBackArrowIndexes: number[] = [0, 1, 2, 3, 4, 5, 6, 7]

  constructor(props: Props) {
    super(props)
    this.state = {
      currentPage: props.pendingMigration ? 0 : 1
    }
  }

  noForwardArrowIndexes = () => {
    return [4, 5, 6, 7]
  }

  nextPage = () => {
    if (this.pages && this.pages.props.children.length - 1 > this.state.currentPage) {
      this.pages.scrollToPage(this.state.currentPage + 1)
    }
  }

  previousPage = () => {
    if (this.state.currentPage > 0) {
      this.pages.scrollToPage(this.state.currentPage - 1)
    }
  }

  onScrollEnd = (index: number) => {
    this.setState({ currentPage: index })
  }

  complete = () => {
    this.props.complete()
    this.props.navigation.navigate('StatusCheck')
  }

  render() {
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
            <OnboardingMessage
              title='Big Changes Under the Hood'
              image={require('./statics/secure.png')}
            >
                We're working fast to make Textile Photos even better for you.
                Your old data isn't compatible with this new version of the app,
                so for now, you'll be starting fresh. The migration will create
                a local map of your private photos and your contacts so they can
                be restored in a future release. ;)
            </OnboardingMessage>
            <OnboardingMessage
              title='Own your memories'
              subtitle='Your data is stored in a decentralized system to bring you full ownership of your photos.'
              image={require('./statics/secure.png')}
            />
            <OnboardingMessage
              title='Better together'
              subtitle='Create private threads to share your photos with friends and family.'
              image={require('./statics/share.png')}
            />
            <OnboardingMessage
              title='Backed up safely'
              subtitle='Everytime you take a picture, Textile will be there to automatically sync your photos.'
              image={require('./statics/sync.png')}
            />
            <OnboardingUsername onSuccess={this.nextPage} suggestion={this.props.migrationUsername} />
            <SetAvatar onSuccess={this.nextPage} />
            <MailListSignupScreen onSuccess={this.nextPage} />
            <OnboardingMessage
              title='All ready!'
              subtitle="You're all set up. Enjoy using Textile :)"
              image={require('./statics/sync.png')}
              buttonText='Get Started'
              onButtonPress={this.complete}
            />
          </Pages>
          {this.noBackArrowIndexes.indexOf(this.state.currentPage) === -1 &&
            <TouchableOpacity hitSlop={{ top: 10, left: 10, bottom: 10, right: 10}} style={ARROW_BACK} onPress={this.previousPage}>
              <Icon name={'arrow-left'} size={24} />
            </TouchableOpacity>
          }
          {this.noForwardArrowIndexes().indexOf(this.state.currentPage) === -1 &&
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
  migrationUsername: state.migration.username,
  pendingMigration: state.preferences.pendingMigration
})

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => ({
  complete: () => dispatch(PrefrencesActions.onboardedSuccess())
})

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingScreen)
