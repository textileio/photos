import React, { Fragment } from 'react'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native'
import ImageSc from 'react-native-scalable-image'
import Avatar from '../../../Components/Avatar'

import Logo from '../../components/Logo'

import styles from './statics/styles'

const Step1 = props => {
  const { chooseProfilePicture } = props
  let title = 'Welcome aboard'
  let username = props.username
  let subtitle = 'Before starting to use Textile, we need you to upload your profile picture'
  let linkText = 'Select Profile Picture'
  const previewSrc = require('./statics/user-add.png')
  const params = props.navigation.state.params
  const avatarUrl = params && params.avatarUrl
  if (params) {
    title = 'Looking good'
    subtitle = undefined
    username = params.username && params.username + '!'
    linkText = 'Change Avatar'
  }
  return (
    <Fragment>
      <ScrollView>
        <Logo style={styles.headerContainer} logoStyle={styles.logo}>
          <Text style={styles.title}>{title}</Text>
          <Text style={[styles.title, styles.strong]}>{username}</Text>
        </Logo>
        <View style={styles.contentContainer}>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          <TouchableOpacity onPress={chooseProfilePicture} style={styles.uploadContainer}>
            {!avatarUrl && <ImageSc style={styles.uploadIcon} width={79} height={79} source={previewSrc} />}
            {avatarUrl && <Avatar
              width={79}
              height={79}
              uri={params.avatarUrl}
              style={styles.avatarPhoto}
              defaultSource={require('../Settings/statics/main-image.png')}
            />}

            <Text style={styles.link}>{linkText}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Fragment>
  )
}

export default Step1
