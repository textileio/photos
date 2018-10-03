import React, { Component, Fragment } from 'react'
import { Text, Image, View } from 'react-native'
import { SafeAreaView } from 'react-navigation'

import Footer from './Footer'
import styles from './statics/styles'

import { pages } from './constants'

export default class OnBoarding extends Component {
  constructor (props) {
    super(props)
    this.state = {
      step: 0
    }
  }
  onNext = () => {
    this.setState({
      step: this.state.step + 1
    })
  }
  onSubmit = () => {
    this.props.navigation.navigate('SignUp')
  }
  render () {
    const { step } = this.state

    return (
      <Fragment>
        <SafeAreaView style={styles.safeContainerTop} />
        <SafeAreaView style={styles.safeContainerBottom}>
          <View style={styles.onBoardingContainer}>
            {pages.map(page => (
              <Fragment key={page.image}>
                {page.order === step &&
                  <Fragment>
                    <View style={styles.imageContainer}>
                      <Image source={page.image} />
                    </View>
                    <View style={styles.titleContainer}>
                      <Text style={styles.title}>{page.title}</Text>
                    </View>
                    <Text style={styles.subtitle}>{page.subTitle}</Text>
                  </Fragment>}
              </Fragment>
            ))}
          </View>
          <Footer
            currentPageIndex={step}
            pages={pages}
            onNext={this.onNext}
            onSkip={this.onSubmit}
            onSubmit={this.onSubmit}
          />
        </SafeAreaView>

      </Fragment>
    )
  }
}
