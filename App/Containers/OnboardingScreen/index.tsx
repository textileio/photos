import React from 'react'
import { SafeAreaView, ViewStyle, View, TouchableOpacity } from 'react-native'
import { Pages } from 'react-native-pages'

import { COLOR_BACKGROUND_PRIMARY, COLOR_GREY_LIGHT, COLOR_BRAND_PINK, MARGIN_STANDARD, MARGIN_SMALL } from '../../Themes/Constants'
import OnboardingMessage from '../../Components/OnboardingMessage'
import MailListSignupScreen from '../MailListSignupScreen'
import ShowMnemonic from '../ShowMnemonic'
import VerifyMnemonic from '../VerifyMnemonic'
import Icon from '../../Components/Icon'

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

interface State {
  currentPage: number
}

export default class OnboardingScreen extends React.Component<{}, State> {

  pages?: Pages
  noBackArrowIndexes: number[] = [0, 1, 2, 3, 4, 6]
  noForwardArrowIndexes: number[] = [3, 5]

  constructor(props: {}) {
    super(props)
    this.state = {
      currentPage: 0
    }
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

  render() {
    return (
      <SafeAreaView style={CONTAINER}>
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
          <MailListSignupScreen onSuccess={this.nextPage} />
          <ShowMnemonic />
          <VerifyMnemonic onSuccess={this.nextPage} />
          <OnboardingMessage
            title='All ready!'
            subtitle="You're all set up. Enjoy using Textile :)"
            image={require('./statics/sync.png')}
          />
        </Pages>
        {this.noBackArrowIndexes.indexOf(this.state.currentPage) === -1 &&
          <TouchableOpacity hitSlop={{ top: 10, left: 10, bottom: 10, right: 10}} style={ARROW_BACK} onPress={this.previousPage}>
            <Icon name={'arrow-left'} size={24} />
          </TouchableOpacity>
        }
        {this.noForwardArrowIndexes.indexOf(this.state.currentPage) === -1 &&
          <TouchableOpacity hitSlop={{ top: 10, left: 10, bottom: 10, right: 10}} style={ARROW_FORWARD} onPress={this.nextPage}>
            <Icon name={'arrow-right'} size={24} />
          </TouchableOpacity>
        }
      </SafeAreaView>
    )
  }
}
