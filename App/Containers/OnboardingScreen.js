import React, { Component } from 'react'
import { Text, Button, View } from 'react-native'
import { connect } from 'react-redux'
import styles, { buttonColor } from './Styles/OnboardingScreenStyle'

class OnboardingScreen extends Component {
  render () {
    const { navigate } = this.props.navigation
    return (
      <View style={styles.welcomeContainer}>
        <View style={styles.messageContainer}>
          <Text style={styles.header}>{this.props.navigation.state.params.header}</Text>
          {this.props.navigation.state.params.message}
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

const mapDispatchToProps = (dispatch) => {
  return { dispatch }
}

export default connect(undefined, mapDispatchToProps)(OnboardingScreen)
