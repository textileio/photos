import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, Image, Button, View } from 'react-native'
import { connect } from 'react-redux'
import Actions from '../Redux/TextileRedux'

// Styles
import styles from './Styles/OnboardingScreenStyle'
import Ionicon from "react-native-vector-icons/Ionicons";

class OnboardingPhotosPermissions extends Component {

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    return {
      headerTitle: 'Permissions',
    }
  };

  render () {
    const { navigate } = this.props.navigation
    return (
      <View style={{flex:1}}>
        <ScrollView style={styles.container}>
          <KeyboardAvoidingView behavior='position'>
            <Text style={styles.header}>We need location data enabled</Text>
            <View style={styles.imageView}>
              <Text style={styles.message}>
                Please take a moment to authorize geolocation. We never keep this
                data, we just use it to wake up the app so it can continuously
                backup your photos.
              </Text>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
        <Button
          onPress={() => {
            navigator.geolocation.requestAuthorization();
            this.props.onboardedSuccess();
            this.props.navigation.dismiss();
          }}
          title="Authorize"
          accessibilityLabel="Complete onboarding experience"
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

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingPhotosPermissions)
