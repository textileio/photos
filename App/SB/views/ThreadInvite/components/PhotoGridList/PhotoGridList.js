import React from 'react'
import { View, Text, ScrollView } from 'react-native'

import PhotoGrid from '../../../../components/PhotoGrid'

import styles from '../../statics/styles'

const PhotoGridList = props => {
  const { type, photos, active, onScroll, onLabelMounted, onElementMounted } = props

  return [
    <Text onLayout={e => onLabelMounted(e.nativeEvent.layout.y)} key='0' style={styles.fixedDate}>
      <Text style={styles.bold}>{photos[active].month}</Text> {photos[active].photos.length} photos
    </Text>,
    <ScrollView collapsable key='1' onScroll={onScroll} scrollEventThrottle={100} style={styles.contentContainer}>
      { photos.map((item, i) => [
        <View onLayout={e => onElementMounted(i, e.nativeEvent.layout.y)} key='label'>
          { i && (
            <Text style={styles.fixedDate}>
              <Text style={styles.bold}>{item.month}</Text> {item.photos.length} photos
            </Text>
          )}
        </View>,
        <PhotoGrid key={i} type={type} photos={item.photos} />
      ]) }
    </ScrollView>
  ]
}

export default PhotoGridList
