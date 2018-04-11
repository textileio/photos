import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, Button, View } from 'react-native'
import { connect } from 'react-redux'
import {getPhoto} from '../Services/PhotoUtils'
import styles from './Styles/OnboardingScreenStyle'

class OnboardingPhotosPermissions extends Component {
  async handlePress () {
    await getPhoto() // Trigger photos permission prompt
    this.props.navigation.navigate('OnboardingLocationPermissions')
  }
  render () {
    return (
      <View style={{flex: 1}}>
        <ScrollView style={styles.container}>
          <KeyboardAvoidingView behavior='position'>
            <Text style={styles.header}>We need to access your photos.. surprise!</Text>
            <Text style={styles.message}>
              Please take a moment to authorize photo/camera access so we can privately back them up for you. But
              don't worry, they'll be encrypted and securely uploaded to protect your privacy.
            </Text>
          </KeyboardAvoidingView>
        </ScrollView>
        <Button
          onPress={this.handlePress.bind(this)}
          title='Authorize'
          accessibilityLabel='Photos authorization'
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

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingPhotosPermissions)
