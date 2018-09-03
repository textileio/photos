import React, { Fragment } from 'react'
import { Text, View, ScrollView, TouchableOpacity, Keyboard, TouchableWithoutFeedback } from 'react-native'

import Input from '../../components/Input'
import Footer from '../../components/Footer'
import Logo from '../../components/Logo'
import Button from '../../components/Button'
import Alert from '../../components/Alert'

import commonStyles from '../commonStyles'
import styles from './statics/styles'

const Step1 = props => {
  const { referralCode, email, updateReferralCode, updateEmail, onNextStep, switchToSignIn, displayError, errorMessage } = props

  return (
    <Fragment>
      <ScrollView style={commonStyles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <Logo>
            <Text style={styles.headerText}>Welcome! Who are you?</Text>
          </Logo>
        </TouchableWithoutFeedback>
        <View style={styles.formContainer}>
          <Input
            value={referralCode}
            label='Referral Code'
            onChangeText={updateReferralCode}
            keyboardType='default'
            autoCapitalize='characters'
            style={{ height: 40 }}
          />
          <Input
            value={email}
            label='Email'
            onChangeText={updateEmail}
            keyboardType='email-address'
            autoCapitalize='none'
            style={{ height: 40 }}
          />
          <View style={styles.bottomLine}>
            <Button
              text='Continue'
              disabled={!referralCode || !email}
              onPress={onNextStep}
            />
          </View>
        </View>
      </ScrollView>
      <Alert display={displayError} top msg={'Sign up error: ' + errorMessage} />
      <Footer>
        <Text style={styles.footerText}>Already have an account? </Text>
        <TouchableOpacity onPress={switchToSignIn}>
          <Text style={[styles.footerLink, styles.link, styles.strong]}>Sign In</Text>
        </TouchableOpacity>
      </Footer>
    </Fragment>
  )
}

export default Step1
