import React, { Fragment } from 'react'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native'

import Logo from '../../components/Logo'
import Button from '../../components/Button'
import UserProfilePhoto from '../../components/UserProfilePhoto'

import styles from './statics/styles'

const Step2 = props => {
  const { chooseProfilePicture, profilePictureData } = props
  const source = { uri: 'data:image/jpeg;base64,' + profilePictureData }
  return (
    <Fragment>
      <ScrollView>
        <Logo style={styles.headerContainer} logoStyle={styles.logoStep2}>
          <Text style={styles.title}>This is a very good photo!</Text>
        </Logo>
        <View style={styles.contentContainer}>
          <View style={styles.uploadContainer}>
            <UserProfilePhoto style={styles.photoUploaded} width={183} source={source} />
            <Button style={styles.uploadButton} text='Confirm Picture' onPress={() => {}} />
            <TouchableOpacity onPress={chooseProfilePicture}>
              <Text style={styles.link}>Select Profile Picture</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Fragment>
  )
}

export default Step2