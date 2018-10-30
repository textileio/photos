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
  const nodeState = state.textileNode.nodeState
  return {
    ...state.auth.formData,
    displayError: state.auth.error !== undefined,
    errorMessage: state.auth.error
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateReferralCode: (referralCode) => dispatch(AuthActions.updateReferralCode(referralCode)),
    updateEmail: (email) => dispatch(AuthActions.updateEmail(email)),
    updateUsername: (username) => dispatch(AuthActions.updateUsername(username)),
    updatePassword: (password) => dispatch(AuthActions.updatePassword(password)),
    submit: (referralCode, email, username, password) => dispatch(AuthActions.signUpRequest(referralCode, email, username, password))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUpContainer)
