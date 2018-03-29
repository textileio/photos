import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, Image, Button, View } from 'react-native'
import { connect } from 'react-redux'

// Styles
import styles from './Styles/OnboardingScreenStyle'
import Ionicon from "react-native-vector-icons/Ionicons";

class OnboardingShare extends Component {
  render () {
    const { navigate } = this.props.navigation
    return (
      <View style={{flex:1}}>
        <ScrollView style={styles.container}>
          <KeyboardAvoidingView behavior='position'>
            <Text style={styles.header}>Share with friends and family</Text>
            <View style={styles.imageView}>
              <Image
                style={styles.imageIcon}
                source={require("../Images/Onboarding/cloud-share.png")}
              />
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
        <Button
          onPress={() => navigate('OnboardingBetaWelcome')}
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

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingShare)
