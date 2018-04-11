import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, Button, View } from 'react-native'
import { connect } from 'react-redux'
import styles from './Styles/OnboardingScreenStyle'

class OnboardingLocationPermissions extends Component {
  async handlePress () {
    await navigator.geolocation.requestAuthorization()
    this.props.navigation.navigate('OnboardingThanks')
  }
  render () {
    // const { navigate } = this.props.navigation
    return (
      <View style={{flex: 1}}>
        <ScrollView style={styles.container}>
          <KeyboardAvoidingView behavior='position'>
            <Text style={styles.header}>Location, location, location…</Text>
            <Text style={styles.message}>
              Please take a moment to authorize geolocation so we can use your location changes to wake up the app,
              making sure your photos are continuously backed up, even when you’re on the go.
            </Text>
          </KeyboardAvoidingView>
        </ScrollView>
        <Button
          onPress={this.handlePress.bind(this)}
          title='Authorize'
          accessibilityLabel='Geolocation authorization'
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingLocationPermissions)
