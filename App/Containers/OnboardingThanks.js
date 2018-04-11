import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, Button, View } from 'react-native'
import { connect } from 'react-redux'
import styles from './Styles/OnboardingScreenStyle'
import Actions from '../Redux/TextileRedux'

class OnboardingWelcome extends Component {
  async handlePress () {
    await this.props.onboardedSuccess()
    this.props.navigation.navigate('PhotosNavigation')
  }
  render () {
    return (
      <View style={{flex: 1}}>
        <ScrollView style={styles.container}>
          <KeyboardAvoidingView behavior='position'>
            <Text style={styles.header}>Thanks!</Text>
            <Text style={styles.message}>
              We can’t wait for you to get started! So why not take a quick photo, and see what we’re all about. And
              if you’d like to learn more about our Beta program, please check out our website for details.
            </Text>
          </KeyboardAvoidingView>
        </ScrollView>
        <Button
          onPress={this.handlePress.bind(this)}
          title='Done'
          accessibilityLabel='Done'
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => ({
  onboardedSuccess: () => dispatch(Actions.onboardedSuccess())
})

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingWelcome)
