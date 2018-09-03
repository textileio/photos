import React from 'react'
import { View, Text, Image } from 'react-native'
import ImageSc from 'react-native-scalable-image'

import Toolbar from '../../components/Toolbar'

import styles from './statics/styles'

const PhotoDetail = () => {
  return (
    <View style={styles.container}>
      <Toolbar
        style={styles.toolbar}
        left={<Image style={styles.toolbarLeft} source={require('./statics/icon-arrow-left.png')} />}
      >
        <Text style={styles.toolbarTitle}>Invite friends</Text>
      </Toolbar>
      <View style={styles.contentContainer}>
        <ImageSc style={styles.mainImage} width={125} source={require('./statics/image.png')} />
        <Text style={styles.imageText}>Invite your friends to the app now!</Text>
        <View style={styles.imageList}>
          <ImageSc width={48} source={require('./statics/icon-social-1.png')} />
          <ImageSc width={48} source={require('./statics/icon-social-2.png')} />
          <ImageSc width={48} source={require('./statics/icon-social-3.png')} />
          <ImageSc width={48} source={require('./statics/icon-social-4.png')} />
        </View>
        <View style={styles.imageList}>
          <ImageSc width={48} source={require('./statics/icon-social-5.png')} />
          <ImageSc width={48} source={require('./statics/icon-social-6.png')} />
          <ImageSc width={48} source={require('./statics/icon-social-7.png')} />
          <ImageSc width={48} source={require('./statics/icon-social-8.png')} />
        </View>
      </View>
    </View>
  )
}

export default PhotoDetail
