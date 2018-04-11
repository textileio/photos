import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, Button, View } from 'react-native'
import { connect } from 'react-redux'
import styles from './Styles/OnboardingScreenStyle'

class Onboarding3 extends Component {
  render () {
    const { navigate } = this.props.navigation
    return (
      <View style={{flex: 1}}>
        <ScrollView style={styles.container}>
          <KeyboardAvoidingView behavior='position'>
            <Text style={styles.header}>Private, secure, fast, and distributed.</Text>
            <Text style={styles.message}>
              Right now, the Textile mobile app quietly listens for new photos you take with your camera. Next, it
              securely encrypts those photos in a way that only you (not even our servers) can ever open them. It
              then stores those files on servers using a system called, IPFS. All the while, it generates a private
              wallet that you can keep and eventually move to other systems where you keep control of all your data.
            </Text>
          </KeyboardAvoidingView>
        </ScrollView>
        <Button
          onPress={() => navigate('Onboarding4')}
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

export default connect(mapStateToProps, mapDispatchToProps)(Onboarding3)
