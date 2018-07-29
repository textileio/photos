import React from 'react'
import { connect } from 'react-redux'

import SignUp from './SignUp'

import AuthActions from '../../../Redux/AuthRedux'

class SignUpContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      step: 0
    }
  }

  switchToSignIn = () => {
    this.props.navigation.navigate('SignIn')
  }

  onNextStep = () => {
    const { step } = this.state
    this.setState({
      step: step + 1
    })
  }

  onPreviousStep = () => {
    const { step } = this.state
    this.setState({
      step: step - 1
    })
  }

  render () {
    return (
      <SignUp
        {...this.props}
        {...this.state}
        switchToSignIn={this.switchToSignIn}
        onNextStep={this.onNextStep}
        onPreviousStep={this.onPreviousStep}
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
    updateReferralCode: (referralCode: string) => dispatch(AuthActions.updateReferralCode(referralCode)),
    updateEmail: (email: string) => dispatch(AuthActions.updateEmail(email)),
    updateUsername: (username: string) => dispatch(AuthActions.updateUsername(username)),
    updatePassword: (password: string) => dispatch(AuthActions.updatePassword(password)),
    submit: (referralCode: string, email: string, username: string, password: string) => dispatch(AuthActions.signUpRequest(referralCode, email, username, password))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpContainer)