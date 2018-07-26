import React from 'react'
import { View, Text, Image, Dimensions, ScrollView } from 'react-native'
import ImageSc from 'react-native-scalable-image'

import Toolbar from '../../components/Toolbar'
import BottomDrawerPhotos from '../../components/BottomDrawerPhotos'
import PhotoWithTextBox from '../../components/PhotoWithTextBox'
import PhotoBoxEmpty from '../../components/PhotoBoxEmpty'

import styles from './statics/styles'
import { photoList } from './constants'
const { width } = Dimensions.get('window')

const PhotoDetail = () => {
  const drawer = false

  return (
    <View style={styles.container}>
      <Toolbar
        style={styles.toolbar}
        left={<Image style={styles.toolbarLeft} source={require('./statics/icon-arrow-left.png')} />}
        right={
          <View style={styles.toolbarIconsList}>
            <Image style={styles.toolbarAddIcon} source={require('./statics/icon-add.png')} />
            <Image style={styles.toolbarDownloadIcon} source={require('./statics/icon-download.png')} />
            <Image style={styles.toolbarShareIcon} source={require('./statics/icon-share.png')} />
            <Image style={styles.toolbarRemoveIcon} source={require('./statics/icon-remove.png')} />
          </View>
        }
      />
      <ImageSc width={width} source={require('./statics/photo3.png')} />
      <View style={styles.photoDetails}>
        <View style={styles.detailItem}>
          <Image style={styles.iconLocation} source={require('./statics/icon-location.png')} />
          <Text style={styles.detailText}>San Francisco</Text>
        </View>
        <View style={[styles.detailItem, { marginLeft: 24, flexGrow: 1 }]}>
          <Image style={styles.iconCalendar} source={require('./statics/icon-calendar.png')} />
          <Text style={styles.detailText}>20/03/2018</Text>
        </View>
        <Image style={styles.iconInfo} source={require('./statics/icon-info.png')} />
      </View>
      <ScrollView style={styles.contentContainer}>
        <Text style={styles.threadsTitle}>This photo appears in the following threads:</Text>
        <PhotoWithTextBox text='San Francisco' photo={require('./statics/photo1.png')} />
        <PhotoWithTextBox text='San Francisco' photo={require('./statics/photo2.png')} />
        <PhotoBoxEmpty style={{ marginBottom: 9, marginTop: 0 }} />
      </ScrollView>
      { drawer && <BottomDrawerPhotos list={photoList} /> }
    </View>
  )
}

export default PhotoDetail
