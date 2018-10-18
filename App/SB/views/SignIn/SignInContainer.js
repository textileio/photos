import React from 'react'
import { connect } from 'react-redux'

import SignIn from './SignIn'

import AuthActions from '../../../Redux/AuthRedux'

class SignInContainer extends React.Component {
  switchToSignUp = () => {
    this.props.navigation.goBack()
  }

  render () {
    return (
      <SignIn
        {...this.props}
        switchToSignUp={this.switchToSignUp}
      />
    )
  }
}

const mapStateToProps = state => {
  return {
    ...state.auth.formData,
    displayError: state.auth.error !== undefined,
    errorMessage: state.auth.error
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateUsername: (username) => dispatch(AuthActions.updateUsername(username)),
    updatePassword: (password) => dispatch(AuthActions.updatePassword(password)),
    submit: (username, password) => dispatch(AuthActions.logInRequest(username, password))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignInContainer)
