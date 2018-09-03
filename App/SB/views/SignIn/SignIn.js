import React, { Fragment } from 'react'
import { Text, View, ScrollView, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native'

import Input from '../../components/Input'
import Footer from '../../components/Footer'
import Logo from '../../components/Logo'
import Button from '../../components/Button'
import Alert from '../../components/Alert'

import commonStyles from '../commonStyles'
import styles from './statics/styles'

const SignIn = props => {
  const { username, password, updateUsername, updatePassword, submit, switchToSignUp, displayError, errorMessage } = props

  return (
    <Fragment>
      <ScrollView style={commonStyles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <Logo>
            <Text style={styles.headerText}>Please sign in to continue</Text>
          </Logo>
        </TouchableWithoutFeedback>
        <View style={styles.formContainer}>
          <Input
            value={username}
            label='Username'
            onChangeText={updateUsername}
            keyboardType='default'
            autoCapitalize='none'
            style={{ height: 40 }}
          />
          <Input
            value={password}
            label='Password'
            secureTextEntry
            onChangeText={updatePassword}
            keyboardType='default'
            autoCapitalize='none'
            style={{ height: 40 }}
          />
          {/* TODO: Forgot pw support */}
          {/* <Text style={styles.forgotText}>Forgot password</Text> */}
          <View style={styles.bottomLine}>
            <Button
              text='Sign In'
              disabled={!username || !password}
              onPress={() => submit(username, password)}
            />
          </View>
        </View>
      </ScrollView>
      <Alert display={displayError} top msg={'Sign in error: ' + errorMessage} />
      <Footer>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={switchToSignUp}>
          <Text style={[styles.footerLink, styles.link]}>Sign Up</Text>
        </TouchableOpacity>
      </Footer>
    </Fragment>
  )
}

export default SignIn
