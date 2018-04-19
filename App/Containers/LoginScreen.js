import React, { Component } from 'react'
import { Image, Text, KeyboardAvoidingView, TouchableHighlight } from 'react-native'
import t from 'tcomb-form-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/LoginScreenStyle'
import formStyle from './Styles/FormStyle'

const Form = t.form.Form
t.form.Form.stylesheet = formStyle

const Person = t.struct({
  email: t.String,
  password: t.String
})

const options = {
  stylesheet: formStyle
}

class LoginScreen extends Component {

  onPress () {
    // call getValue() to get the values of the form
    var value = this.refs.form.getValue();
    if (value) { // if validation fails, value will be null
      console.log(value); // value here is an instance of Person
    }
  }

  render () {
    return (
      <KeyboardAvoidingView behavior='padding' style={styles.container}>
        {/*<Image style={styles.image} source={require('../Images/Icon_150.png')} />*/}
        <Form
          ref='form'
          type={Person}
          options={options}
        />
        <TouchableHighlight style={styles.button} onPress={this.onPress.bind(this)} underlayColor='#99d9f4'>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableHighlight>
      </KeyboardAvoidingView>
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)
