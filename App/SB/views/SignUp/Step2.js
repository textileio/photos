import React, { Fragment } from 'react'
import { Text, View, TouchableOpacity, ScrollView, Keyboard, TouchableWithoutFeedback } from 'react-native'

import Input from '../../components/Input'
import Footer from '../../components/Footer'
import Logo from '../../components/Logo'
import Button from '../../components/Button'
import Alert from '../../components/Alert'

import commonStyles from '../commonStyles'
import styles from './statics/styles'

const Step1 = props => {
  const { referralCode, email, username, password, updateUsername, updatePassword, onPreviousStep, submit, displayError, errorMessage } = props

  const hasError = false // TODO: toggle this to display error msg on input

  return (
    <Fragment>
      <ScrollView style={commonStyles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <Logo>
            <Text style={styles.headerText}>Now create your account to finish.</Text>
          </Logo>
        </TouchableWithoutFeedback>
        <View style={styles.formContainer}>
          <Input
            value={username}
            label='Username'
            error={hasError}
            errorMsg='This username is already taken'
            onChangeText={updateUsername}
            keyboardType='email-address'
            autoCapitalize='none'
            style={{ height: 40 }}
          />
          <View style={{ position: 'relative' }}>
            <Input
              value={password}
              label='Password'
              secureTextEntry
              onChangeText={updatePassword}
              keyboardType='default'
              autoCapitalize='none'
              style={{ height: 40 }}
            />
            {/* TODO: somthing with pw strength */}
            {/* <View style={{ position: 'absolute', right: 0, bottom: 20 }}>
              <PasswordValidator display={password} password={password} />
            </View> */}
          </View>
          <View style={styles.bottomLine}>
            <Text style={styles.bottomLineLink}>By signing up you agree to our <Text style={styles.link}>Terms and Conditions</Text></Text>
            <Button
              text='Create account'
              disabled={!username || !password}
              onPress={() => submit(referralCode, email, username, password)}
            />
          </View>
        </View>
      </ScrollView>
      <Alert display={displayError} top msg={'Sign up error: ' + errorMessage} />
      <Footer>
        <TouchableOpacity onPress={onPreviousStep}>
          <Text style={[styles.footerLink, styles.link, styles.strong]}>Go back</Text>
        </TouchableOpacity>
      </Footer>
    </Fragment>
  )
}

export default Step1
