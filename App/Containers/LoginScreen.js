import React, { Component } from 'react'
import {
  View,
  Image,
  Linking,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Keyboard,
  SafeAreaView,
  Platform
} from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import t from 'tcomb-form-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
import AuthActions, { SignUp, LogIn, RecoverPassword } from '../Redux/AuthRedux'
import DropdownAlert from 'react-native-dropdownalert'

// Styles
import styles from './Styles/LoginScreenStyle'
import formStyle from './Styles/FormStyle'

const Form = t.form.Form
t.form.Form.stylesheet = formStyle

const options = {
  stylesheet: formStyle,
  auto: 'placeholders',
  fields: {
    referralCode: {
      autoCapitalize: 'characters'
    },
    username: {
      autoCapitalize: 'none'
    },
    email: {
      autoCapitalize: 'none',
      keyboardType: 'email-address'
    },
    password: {
      autoCapitalize: 'none',
      secureTextEntry: true
    }
  }
}

class LoginScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state
    return {
      title: params.navigationTitle
    }
  }

  onPress () {
    Keyboard.dismiss()
    let value = this.refs.form.getValue()
    if (value) { // if validation fails, value will be null
      const p = this.props
      const f = this.props.formType
      const submitFunction = f === SignUp ? p.signUpRequest : (f === LogIn ? p.logInRequest : p.recoverPasswordRequest)
      submitFunction(value)
    }
  }

  componentDidMount () {
    this.props.navigation.setParams({ navigationTitle: this.props.navigationTitle })
    // Possibly could be combined with the PairingView deeplink logic
    if (Platform.OS === 'android') {
      Linking.getInitialURL().then(url => {
        this._handleOpenURL(url)
      })
    } else {
      Linking.addEventListener('url', this._handleOpenURLEvent.bind(this))
    }
  }

  componentDidUpdate () {
    if (this.props.error !== null) {
      this.dropdown.alertWithType('error', 'Error', this.props.error)
      this.props.dismissError()
    }
  }

  _handleOpenURLEvent (event) {
    this._handleOpenURL(event.url)
  }

  _handleOpenURL (url) {
    let path = url.split('://')[1]
    if (!path) { path = url }
    path = path.split('/')[1]
    if (url && path === 'invites') {
      let regex = /[?&]([^=#]+)=([^&#]*)/g
      let params = {}
      let match
      while (match = regex.exec(url)) {
        params[match[1]] = match[2]
      }
      if (params.referral) {
        this.props.updateFormValue({'referralCode': params.referral})
      }
    }
  }

  handleButtonPress (formType, navigationTitle) {
    this.props.updateFormType(formType)
    this.props.navigation.setParams({ navigationTitle })
  }

  onChange (value) {
    this.props.updateFormValue(value)
  }

  render () {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#ffffff'}}>
        <KeyboardAwareScrollView
          keyboardShouldPersistTaps='always'
          resetScrollToCoords={{ x: 0, y: 0 }}
          contentContainerStyle={styles.container}
        >
          <View style={{flexGrow: 0.6, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Image source={require('../Images/Icon_100.png')} />
          </View>
          <Form
            ref='form'
            type={this.props.formType}
            value={this.props.formValue}
            onChange={this.onChange.bind(this)}
            options={options}
          />
          <TouchableHighlight style={styles.button} onPress={this.onPress.bind(this)} underlayColor='#99d9f4'>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableHighlight>
          <View style={{flexGrow: 0.4, flex: 1, flexDirection: 'row', justifyContent: 'space-evenly', alignItems: 'flex-end'}}>
            {this.renderButtons()}
          </View>
          <DropdownAlert errorColor='#FFB6D5' closeInterval={5000} ref={(ref) => { this.dropdown = ref }} />
        </KeyboardAwareScrollView>
      </SafeAreaView>
    )
  }

  renderButtons () {
    return this.props.buttonData.map((button, i) => {
      return <TouchableOpacity key={i} onPress={() => this.handleButtonPress(button.formType, button.navigationTitle)}>
        <Text style={styles.optionText}>{button.title}</Text>
      </TouchableOpacity>
      // return <Button title={button.title} onPress={button.action} key={i} />
    })
  }
}

const mapStateToProps = state => {
  let buttonData
  let navigationTitle
  let error = state.auth.error
  switch (state.auth.formType) {
    case SignUp:
      buttonData = [
        { formType: LogIn, title: 'Log In Instead', navigationTitle: 'Log In' }
      ]
      navigationTitle = 'Sign Up'
      break
    case LogIn:
      buttonData = [
        { formType: SignUp, title: 'Sign Up', navigationTitle: 'Sign Up' },
        { formType: RecoverPassword, title: 'Forgot Password?', navigationTitle: 'Recover Password' }
      ]
      navigationTitle = 'Log In'
      break
    default:
      buttonData = [
        { formType: LogIn, title: 'Log In', navigationTitle: 'Log In' }
      ]
      navigationTitle = 'Recover Password'
  }

  return {
    error,
    buttonData,
    navigationTitle,
    formType: state.auth.formType,
    formValue: state.auth.formValue
  }
}

const mapDispatchToProps = dispatch => {
  return {
    dismissError: () => { dispatch(AuthActions.dismissError()) },
    updateFormType: type => { dispatch(AuthActions.updateFormType(type)) },
    updateFormValue: value => { dispatch(AuthActions.updateFormValue(value)) },
    signUpRequest: data => { dispatch(AuthActions.signUpRequest(data)) },
    logInRequest: data => { dispatch(AuthActions.logInRequest(data)) },
    recoverPasswordRequest: data => { dispatch(AuthActions.recoverPasswordRequest(data)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)
