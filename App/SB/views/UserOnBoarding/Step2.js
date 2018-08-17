import React, { Fragment } from 'react'
import { Text, View, ScrollView, TouchableOpacity } from 'react-native'

import Logo from '../../components/Logo'
import Button from '../../components/Button'
import ImageSc from 'react-native-scalable-image'

import styles from './statics/styles'

const Step2 = props => {
  const { chooseProfilePicture, profilePictureData, profilePictureUri, selectProfilePicture } = props
  const source = { uri: 'data:image/jpeg;base64,' + profilePictureData }
  return (
    <Fragment>
      <ScrollView>
        <Logo style={styles.headerContainer} logoStyle={styles.logoStep2}>
          <Text style={styles.title}>This is a very good photo!</Text>
        </Logo>
        <View style={styles.contentContainer}>
          <View style={styles.uploadContainer}>
            <ImageSc style={styles.photoUploaded} width={184} height={184} source={source} />
            <Button style={styles.uploadButton} textStyle={styles.uploadButtonText} text='Confirm Picture' onPress={() => { selectProfilePicture(profilePictureUri) }} />
            <TouchableOpacity onPress={chooseProfilePicture}>
              <Text style={styles.link}>Select New Picture</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </Fragment>
  )
}

export default Step2
