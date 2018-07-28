import React, { Fragment } from 'react'
import { Text, View, ScrollView } from 'react-native'
import { Link } from 'react-router-native'

import Input from '../../components/Input'
import Footer from '../../components/Footer'
import Logo from '../../components/Logo'
import Button from '../../components/Button'
import Alert from '../../components/Alert'

import commonStyles from '../commonStyles'
import styles from './statics/styles'

const SignIn = props => {
  const { username, password, onChange, history } = props
  const displayAlert = false

  return (
    <Fragment>
      <ScrollView style={commonStyles.container}>
        <Logo>
          <Text style={styles.headerText}>Please Login In to continue</Text>
        </Logo>
        <View style={styles.formContainer}>
          <Input
            value={username}
            label="Username"
            onChangeText={value => onChange({ name: 'username', value })}
          />
          <Input
            value={password}
            label="Password"
            secureTextEntry
            onChangeText={value => onChange({ name: 'password', value })}
          />
          <Text style={styles.forgotText}>Forgot password</Text>
          <View style={styles.bottomLine}>
            <Button
              text="Sign in"
              disabled={!username || !password}
              onPress={() => history.push('/welcome')}
            />
          </View>
        </View>
      </ScrollView>
        <Alert display={displayAlert} bottom msg='A link to reset your password has been sent to your email.' />
      <Footer>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <Link to={{pathname: '/signUp'}}>
          <Text style={[styles.footerLink, styles.link]}>Sign Up</Text>
        </Link>
      </Footer>
    </Fragment>
  )
}

export default SignIn