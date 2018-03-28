import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, Image, Button, View } from 'react-native'
import { connect } from 'react-redux'
import HeaderButtons from 'react-navigation-header-buttons'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/OnboardingScreenStyle'
import Ionicon from "react-native-vector-icons/Ionicons";

class OnboardingScreen2 extends Component {

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    return {
      headerTitle: 'Permissions',
      headerRight: (
        <HeaderButtons IconComponent={Ionicon} iconSize={23} color="blue">
          <HeaderButtons.Item title="Done" onPress={() => navigation.dismiss()} />
        </HeaderButtons>
      )
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
            navigator.geolocation.requestAuthorization()
            this.props.navigation.dismiss()
          }}
          title="Authorize"
          accessibilityLabel="Complete onboarding experience"
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingScreen2)
