import React, { Fragment } from 'react'
import {Text, View, ScrollView} from 'react-native'
import { Link } from 'react-router-native'

import Input from '../../components/Input'
import Footer from '../../components/Footer'
import Logo from '../../components/Logo'
import Button from '../../components/Button'

import commonStyles from '../commonStyles'
import styles from './statics/styles'

const Step1 = props => {
  const { name, email, onChange, onNextStep } = props

  return (
    <Fragment>
      <ScrollView style={commonStyles.container}>
        <Logo>
          <Text style={styles.headerText}>Welcome! Who is there?</Text>
        </Logo>
        <View style={styles.formContainer}>
          <Input
            value={name}
            label="Name"
            onChangeText={value => onChange({ name: 'name', value })}
          />
          <Input
            value={email}
            label="Email"
            secureTextEntry
            onChangeText={value => onChange({ name: 'email', value })}
          />
          <View style={styles.bottomLine}>
            <Button
              text="Continue  "
              disabled={!name || !email}
              onPress={onNextStep}
            />
          </View>
        </View>
      </ScrollView>
      <Footer>
        <Text style={styles.footerText}>Already have an account? </Text>
        <Link to={{pathname: '/signIn'}}>
          <Text style={[styles.footerLink, styles.link, styles.strong]}>Sign In</Text>
        </Link>g
      </Footer>
    </Fragment>
  )
}

export default Step1