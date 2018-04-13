import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, Button, View } from 'react-native'
import { connect } from 'react-redux'
import styles, {buttonColor} from './Styles/OnboardingScreenStyle'

class OnboardingScreen extends Component {
  render () {
    const { navigate } = this.props.navigation
    return (
      <View style={styles.welcomeContainer}>
        <View style={styles.messageContainer}>
          <Text style={styles.header}>{this.props.navigation.state.params.header}</Text>
          <Text style={styles.message}>{this.props.navigation.state.params.message}</Text>
        </View>
        <Button
          onPress={this.props.navigation.state.params.onButtonPress(navigate, this.props.dispatch)}
          title={this.props.navigation.state.params.buttonTitle}
          accessibilityLabel='next screen'
          color={buttonColor}
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return { dispatch }
}

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingScreen)
