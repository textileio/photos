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
            <Text style={styles.header}>Welcome to the Textile Beta!</Text>
            <Text style={styles.message}>
              Thanks very much for agreeing to test the app and provide feedback on this very early draft of our brand
              new technology. Right now, Textile is all about photos, soon it will be about how you control and own all
              your personal data.
            </Text>
          </KeyboardAvoidingView>
        </ScrollView>
        <Button
          onPress={() => navigate('Onboarding1')}
          title='Ok'
          accessibilityLabel='Move on to the next screen'
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
