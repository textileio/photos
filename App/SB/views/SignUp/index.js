import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { Text, View, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'

import { Button, Footer, Input, LinkText, LogoWithText } from '../../components/index'
import commonStyles from '../commonStyles'
import styles from './styles'

import AuthActions from '../../../Redux/AuthRedux'

class SignUp extends Component {
    goToSignIn = () => {
      this.props.navigation.navigate('SignIn')
    }

    render () {
      const { email, name, username, password } = this.props
      return (
        <Fragment>
          <View style={commonStyles.container}>
            <LogoWithText text='Sign up to start using the app with your friends.' />
            <View style={styles.formContainer}>
              <Input
                value={name}
                label="Referral Code"
                keyboardType="default"
                autoCapitalize="characters"
                onChangeText={(text) => this.props.updateReferralCode(text)}
              />
              <Input
                value={email}
                label="Email"
                keyboardType="email-address"
                autoCapitalize="none"
                onChangeText={(text) => this.props.updateEmail(text)}
              />
              <Input
                value={username}
                label="Username"
                keyboardType="default"
                autoCapitalize="none"
                onChangeText={(text) => this.props.updateUsername(text)}
              />
              <Input
                value={password}
                label="Password"
                keyboardType="default"
                secureTextEntry
                autoCapitalize="none"
                onChangeText={(text) => this.props.updatePassword(text)}
              />
              <View style={styles.bottomLine}>
                <Text style={styles.bottomLineLink}>By signing up you agree to our <LinkText>Terms and Conditions</LinkText></Text>
                <Button
                  primary
                  title="Create account"
                  disabled={!name || !email || !username || !password}
                  onPress={() => { this.props.submit(name, email, username, password) }}
                />
              </View>
            </View>
          </View>
          <Footer>
            <Text style={styles.footerText}>Already have an account?</Text>
            <TouchableOpacity onPress={this.goToSignIn}>
              <LinkText style={[styles.footerLink, styles.linkColor]}>Sign In</LinkText>
            </TouchableOpacity>
          </Footer>
        </Fragment>
      )
    }
}

const mapStateToProps = state => {
  const { email, name, username, password } = state.auth.formData
  return {
    email,
    name,
    username,
    password
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateReferralCode: (referralCode: string) => { dispatch(AuthActions.updateReferralCode(referralCode)) },
    updateEmail: (email: string) => { dispatch(AuthActions.updateEmail(email)) },
    updateUsername: (username: string) => { dispatch(AuthActions.updateUsername(username)) },
    updatePassword: (password: string) => { dispatch(AuthActions.updatePassword(password)) },
    submit: (name: string, email: string, username: string, password: string) => { dispatch(AuthActions.signUpRequest(name, email, username, password)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignUp)
