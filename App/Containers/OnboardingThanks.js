import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, Button, View } from 'react-native'
import { connect } from 'react-redux'
import styles from './Styles/OnboardingScreenStyle'

class OnboardingWelcome extends Component {
  render () {
    const { navigate } = this.props.navigation
    return (
      <View style={{flex: 1}}>
        <ScrollView style={styles.container}>
          <KeyboardAvoidingView behavior='position'>
            <Text style={styles.header}>Thanks!</Text>
            <Text style={styles.info}>
              We can’t wait for you to get started! So why not take a quick photo, and see what we’re all about. And
              if you’d like to learn more about our Beta program, please check out our website for details.
            </Text>
          </KeyboardAvoidingView>
        </ScrollView>
        <Button
          onPress={() => this.props.navigation.dismiss()}
          title='Ok'
          accessibilityLabel='Done'
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingWelcome)
