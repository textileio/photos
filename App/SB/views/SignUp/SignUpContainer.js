import React from 'react'
import { connect } from 'react-redux'
import { View, Text, Dimensions } from 'react-native'

import SignUp from './SignUp'
import ContactModal from '../UserProfile/ContactModal'
import Logo from '../../components/Logo'

import AuthActions from '../../../Redux/AuthRedux'
import { NodeState } from '../../../Redux/TextileNodeRedux'
import styles from './statics/styles'

const WIDTH = Dimensions.get('window').width

class SignUpContainer extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      step: 0,
      contactModal: false
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

  _contact () {
    this.setState({ contactModal: this.state.contactModal === false })
  }

  render () {
    if (this.props.renderSignUp) {
      return (
        <SignUp
          {...this.props}
          {...this.state}
          switchToSignIn={this.switchToSignIn}
          onNextStep={this.onNextStep}
          onPreviousStep={this.onPreviousStep}
        />
      )
    } else {
      return (
        <View style={{ margin: 11 }}>
          <Logo>
            <Text style={styles.headerText}>Oops, something went very wrong!{'\n'}Please <Text style={styles.link} onPress={this._contact.bind(this)}>contact us</Text> and let us know:</Text>
          </Logo>
          <Text style={[styles.headerText, styles.errorMessage]}>{this.props.nodeError}</Text>
          <ContactModal height={200} width={WIDTH} onClose={this._contact.bind(this)} isVisible={this.state.contactModal} />
        </View>
      )
    }
  }
}

const mapStateToProps = state => {
  const nodeState = state.textileNode.nodeState
  return {
    ...state.auth.formData,
    displayError: state.auth.error !== undefined,
    errorMessage: state.auth.error,
    renderSignUp: nodeState.state !== NodeState.nonexistent && nodeState.state !== NodeState.creating,
    nodeError: nodeState.error || 'unknown error'
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
