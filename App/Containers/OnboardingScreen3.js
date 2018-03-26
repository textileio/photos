import React, { Component } from 'react'
import { Button, ScrollView, Text, KeyboardAvoidingView } from 'react-native'
import { connect } from 'react-redux'
import HeaderButtons from 'react-navigation-header-buttons'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/OnboardingScreenStyle'
import Ionicon from "react-native-vector-icons/Ionicons";

class OnboardingScreen3 extends Component {

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {};
    return {
      headerTitle: 'Onboarding 3',
      headerRight: (
        <HeaderButtons IconComponent={Ionicon} iconSize={23} color='blue'>
          <HeaderButtons.Item title='Complete' onPress={() => navigation.dismiss()} />
        </HeaderButtons>
      )
    }
  };

  render () {
    const { navigation, banner } = this.props
    return (
      <ScrollView style={styles.container}>
        <KeyboardAvoidingView behavior='position'>
          <Text>OnboardingScreen3</Text>
          <Button onPress={() => navigation.dismiss()} title="Dismiss" />
        </KeyboardAvoidingView>
      </ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(OnboardingScreen3)
