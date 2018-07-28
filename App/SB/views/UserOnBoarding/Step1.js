import React, { Fragment } from 'react'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import ImageSc from 'react-native-scalable-image'

import Logo from '../../components/Logo'

import styles from './statics/styles'

const Step1 = props => {
  const { onNextStep } = props

  return (
    <Fragment>
      <ScrollView>
        <Logo style={styles.headerContainer} logoStyle={styles.logo}>
          <Text style={styles.title}>Welcome aboard</Text>
          <Text style={[styles.title, styles.strong]}>Michael</Text>
        </Logo>
        <View style={styles.contentContainer}>
          <Text style={styles.subtitle}>Before starting using Textile, we need you to upload your profile picture</Text>
          <TouchableOpacity onPress={onNextStep} style={styles.uploadContainer}>
            <ImageSc style={styles.uploadIcon} width={79} source={require('./statics/user-add.png')} />
            <Text style={styles.link}>Select Profile Picture </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Fragment>
  )
}

export default Step1