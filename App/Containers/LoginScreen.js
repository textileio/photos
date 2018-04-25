import React, { Component } from 'react'
import { View, Image, Text, TouchableHighlight, TouchableOpacity } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import t from 'tcomb-form-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
import AuthActions from '../Redux/AuthRedux'

// Styles
import styles from './Styles/LoginScreenStyle'
import formStyle from './Styles/FormStyle'

const Form = t.form.Form
t.form.Form.stylesheet = formStyle

const Signup = t.struct({
  referralCode: t.String,
  username: t.String,
  email: t.String,
  password: t.String
})

const Login = t.struct({
  email: t.String,
  password: t.String
})

const PasswordRecovery = t.struct({
  email: t.String
})

const options = {
  stylesheet: formStyle,
  auto: 'placeholders'
}

class LoginScreen extends Component {

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      title: params.navigationTitle
    }
  }

  onPress () {
    var value = this.refs.form.getValue()
    if (value) { // if validation fails, value will be null
      const p = this.props
      const currentState = this.props.currentState
      const submitFunction = currentState === 'signUp' ? p.signUpRequest : (currentState === 'logIn' ? p.logInRequest : p.recoverPasswordRequest)
      submitFunction(value)
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({ navigationTitle: this.props.navigationTitle })
  }

  handleButtonPress(action: string, navigationTitle: string) {
    this.props[action]()
    this.props.navigation.setParams({ navigationTitle })
  }

  render () {
    const currentState = this.props.currentState
    const form = currentState === 'signUp' ? Signup : (currentState === 'logIn' ? Login : PasswordRecovery)
    return (
      <KeyboardAwareScrollView
        style={{ backgroundColor: '#ffffff' }}
        resetScrollToCoords={{ x: 0, y: 0 }}
        contentContainerStyle={styles.container}
      >
        <View style={{flexGrow: 0.6, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <Image source={require('../Images/Icon_100.png')} />
        </View>
        <Form
          ref='form'
          type={form}
          options={options}
        />
        <TouchableHighlight style={styles.button} onPress={this.onPress.bind(this)} underlayColor='#99d9f4'>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableHighlight>
        <View style={{flexGrow: 0.4, flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'flex-end'}}>
          {this.renderButtons()}
          {/*<Button title={'Log In Instead'} />*/}
        </View>
      </KeyboardAwareScrollView>
    )
  }

  renderButtons () {
    const buttons = this.props.buttonData.map((button, i) => {
      return <TouchableOpacity key={i} onPress={() => this.handleButtonPress(button.action, button.navigationTitle)}>
        <Text style={styles.optionText}>{button.title}</Text>
      </TouchableOpacity>
      // return <Button title={button.title} onPress={button.action} key={i} />
    })
    return buttons
  }
}

const mapStateToProps = state => {
  let buttonData
  let navigationTitle
  switch (state.auth.currentState) {
    case 'signUp':
      buttonData = [
        { action: 'logIn', title: 'Log In Instead', navigationTitle: 'Log In' }
      ]
      navigationTitle = 'Sign Up'
      break
    case 'logIn':
      buttonData = [
        { action: 'signUp', title: 'Sign Up', navigationTitle: 'Sign Up' },
        { action: 'recoverPassword', title: 'Forgot Password?', navigationTitle: 'Recover Password' }
      ]
      navigationTitle = 'Log In'
      break
    default:
      buttonData = [
        { action: 'logIn', title: 'Log In', navigationTitle: 'Log In' }
      ]
      navigationTitle = 'Recover Password'
  }
  return {
    currentState: state.auth.currentState,
    buttonData,
    navigationTitle
  }
}

const mapDispatchToProps = dispatch => {
  return {
    signUp: () => { dispatch(AuthActions.signUp()) },
    logIn: () => { dispatch(AuthActions.logIn()) },
    recoverPassword: () => { dispatch(AuthActions.recoverPassword()) },
    signUpRequest: data => { dispatch(AuthActions.signUpRequest(data)) },
    logInRequest: data => { dispatch(AuthActions.logInRequest(data)) },
    recoverPasswordRequest: data => { dispatch(AuthActions.recoverPasswordRequest(data)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)
