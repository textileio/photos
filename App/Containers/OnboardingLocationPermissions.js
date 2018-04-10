import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, Button, View } from 'react-native'
import { connect } from 'react-redux'
import Actions from '../Redux/TextileRedux'
import styles from './Styles/OnboardingScreenStyle'

class OnboardingLocationPermissions extends Component {
  // static navigationOptions = ({ navigation }) => {
  //   const params = navigation.state.params || {}
  //   return {
  //     headerTitle: 'Permissions'
  //   }
  // }
  async handlePress () {
    await navigator.geolocation.requestAuthorization()
    this.props.onboardedSuccess()
    this.props.navigation.navigate('OnboardingThanks')
  }
  render () {
    // const { navigate } = this.props.navigation
    return (
      <View style={{flex: 1}}>
        <ScrollView style={styles.container}>
          <KeyboardAvoidingView behavior='position'>
            <Text style={styles.header}>Location, location, location…</Text>
            <View style={styles.imageView}>
              <Text style={styles.message}>
                Please take a moment to authorize geolocation so we can use your location changes to wake up the app,
                making sure your photos are continuously backed up, even when you’re on the go.
              </Text>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
        <Button
          onPress={this.handlePress}
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
  onboardedSuccess: () => dispatch(Actions.onboardedSuccess())
})

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingLocationPermissions)
