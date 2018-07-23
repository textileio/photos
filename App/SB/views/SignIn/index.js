import React, {Component, Fragment} from 'react'
import PropTypes from 'prop-types'
import {Text, View, TouchableOpacity} from 'react-native'
import { connect } from 'react-redux'

import { Button, Footer, Input, LinkText, LogoWithText } from '../../components/index'
import styles from './styles'
import commonStyles from '../commonStyles'

import AuthActions from '../../../Redux/AuthRedux'

class SignIn extends Component {
  constructor (props) {
    super(props)
    this.state = {username: '', password: ''}
  }

  backToSignUp = () => {
    this.props.navigation.goBack()
  }

  render () {
    const {username, password} = this.props

    return (
      <Fragment>
        <View style={commonStyles.container}>
          <LogoWithText text="Please Login In to continue"/>
          <View style={styles.formContainer}>
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
              secureTextEntry
              keyboardType="default"
              autoCapitalize="none"
              onChangeText={(text) => this.props.updatePassword(text)}
            />
            <Text style={styles.forgotText}>Forgot password</Text>
            <View style={styles.bottomLine}>
              <Button
                primary
                title="Sign In"
                disabled={!username || !password}
                onPress={() => { this.props.submit(username, password) }}
              />
            </View>
          </View>
        </View>
        <Footer>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={this.backToSignUp}>
            <LinkText style={[styles.footerLink, styles.linkColor]}>Sign Up</LinkText>
          </TouchableOpacity>
        </Footer>
      </Fragment>
    )
  }
}

const mapStateToProps = state => {
  const { username, password } = state.auth.formData
  return {
    username,
    password
  }
}

const mapDispatchToProps = dispatch => {
  return {
    updateUsername: (username: string) => { dispatch(AuthActions.updateUsername(username)) },
    updatePassword: (password: string) => { dispatch(AuthActions.updatePassword(password)) },
    submit: (username: string, password: string) => { dispatch(AuthActions.logInRequest(username, password)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignIn)
