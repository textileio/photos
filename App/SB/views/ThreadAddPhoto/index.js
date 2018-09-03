import React from 'react'
import { View, Text, ScrollView, Image } from 'react-native'

import PhotoGrid from '../../components/PhotoGrid'
import Toolbar from '../../components/Toolbar'

import styles from './statics/styles'
import list from './constants'

const ThreadAddPhoto = () => {
  return (
    <View style={styles.container}>
      <Toolbar
        left={<Image style={styles.toolbarLeft} source={require('./statics/icon-arrow-left.png')} />}
      />
      <ScrollView style={styles.contentContainer}>
        <Text style={styles.title}>Select a photo</Text>
        <PhotoGrid type='grid' photos={list} />
      </ScrollView>
    </View>
  )
}

export default ThreadAddPhoto
