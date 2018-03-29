import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, Image, Button, View } from 'react-native'
import { connect } from 'react-redux'
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/OnboardingScreenStyle'
import Ionicon from "react-native-vector-icons/Ionicons";

class OnboardingBetaWelcome extends Component {
  render () {
    const { navigate } = this.props.navigation
    return (
      <View style={{flex:1}}>
        <ScrollView style={styles.container}>
          <KeyboardAvoidingView behavior='position'>
            <Text style={styles.header}>Welcome to the beta!</Text>
            <View style={styles.imageView}>
              <Text style={styles.message}>
                Thanks for joining, and any info about beta feedback, SDKs we use, data we collect
              </Text>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
        <Button
          onPress={() => navigate('OnboardingPermissions')}
          title="Ok"
          accessibilityLabel="Move on to the next screen"
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

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingBetaWelcome)
