import React from 'react'
import { SafeAreaView, Dimensions, ViewStyle } from 'react-native'
import { IndicatorViewPager, PagerDotIndicator} from 'rn-viewpager'

import { COLOR_BACKGROUND_PRIMARY, COLOR_GREY_LIGHT, COLOR_BRAND_BLUE, COLOR_BRAND_PINK, COLOR_BRAND_RED, COLOR_BRAND_YELLOW } from '../../Themes/Constants'
import OnboardingMessage from '../../Components/OnboardingMessage'

const CONTAINER: ViewStyle = {
  flex: 1,
  backgroundColor: COLOR_BACKGROUND_PRIMARY
}

const ITEM: ViewStyle = {
  width: Dimensions.get('screen').width
}

const DOT: ViewStyle = {
  backgroundColor: COLOR_GREY_LIGHT
}

interface State {
  indicatorColor: string
}

export default class OnboardingScreen extends React.Component<{}, State> {

  constructor(props: {}) {
    super(props)
    this.state = {
      indicatorColor: this.randomBrandColor()
    }
  }

  updateBrandColor = () => {
    this.setState({
      indicatorColor: this.randomBrandColor()
    })
  }

  render() {
    return (
      <SafeAreaView style={CONTAINER}>
        <IndicatorViewPager
          style={CONTAINER}
          indicator={this.renderDotIndicator()}
          onPageSelected={this.updateBrandColor}
        >
          <OnboardingMessage
            title='Own your memories'
            subtitle='Your data is stored in a decentralized system to bring you full ownership of your photos.'
            image={require('./statics/secure.png')}
            containerStyle={ITEM}
          />
          <OnboardingMessage
            title='Better together'
            subtitle='Create private threads to share your photos with friends and family.'
            image={require('./statics/share.png')}
            containerStyle={ITEM}
          />
          <OnboardingMessage
            title='Backed up safely'
            subtitle='Everytime you take a picture, Textile will be there to automatically sync your photos.'
            image={require('./statics/sync.png')}
            containerStyle={ITEM}
          />
        </IndicatorViewPager>
      </SafeAreaView>
    )
  }

  renderDotIndicator() {
    return <PagerDotIndicator pageCount={3} dotStyle={DOT} selectedDotStyle={{ backgroundColor: this.state.indicatorColor}} />
  }

  randomBrandColor() {
    const colors = [COLOR_BRAND_BLUE, COLOR_BRAND_PINK, COLOR_BRAND_RED, COLOR_BRAND_YELLOW]
    return colors[Math.floor(Math.random() * colors.length)]
  }
}
