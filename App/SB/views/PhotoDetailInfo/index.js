import React from 'react'
import { View, Text, Image } from 'react-native'

import Toolbar from '../../components/Toolbar'

import styles from './statics/styles'

const PhotoDetail = () => {
  return (
    <View style={styles.container}>
      <Toolbar
        style={styles.toolbar}
        left={<Image style={styles.toolbarLeft} source={require('./statics/icon-arrow-left.png')} />}
      >
        <Text style={styles.toolbarTitle}>Photo info</Text>
      </Toolbar>
      <View style={styles.itemContainer}>
        <Text style={styles.itemTitle}>Name</Text>
        <Text style={styles.itemDescription}>pm5322.jpg</Text>
      </View>
      <View style={styles.itemContainer}>
        <Text style={styles.itemTitle}>Size</Text>
        <Text style={styles.itemDescription}>602 KB</Text>
      </View>
      <View style={styles.itemContainer}>
        <Text style={styles.itemTitle}>Dimension</Text>
        <Text style={styles.itemDescription}>2400 x 1600 pixels</Text>
      </View>
      <View style={styles.itemContainer}>
        <Text style={styles.itemTitle}>Location</Text>
        <Text style={styles.itemDescription}>San Francisco</Text>
      </View>
      <View style={styles.itemContainer}>
        <Text style={styles.itemTitle}>Date</Text>
        <Text style={styles.itemDescription}>20/06/2018</Text>
      </View>
      <View style={styles.itemContainer}>
        <Text style={styles.itemTitle}>Color model</Text>
        <Text style={styles.itemDescription}>RGB</Text>
      </View>
      <View style={styles.itemContainer}>
        <Text style={styles.itemTitle}>Color profile</Text>
        <Text style={styles.itemDescription}>sRGB IEC61966</Text>
      </View>
    </View>
  )
}

export default PhotoDetail
