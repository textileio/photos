import React from 'react'
import { View, Text, Image } from 'react-native'

import Drawer from '../../components/BottomDrawer'
import PhotoWithTextBox from '../../components/PhotoWithTextBox'
import PhotoBoxEmpty from '../../components/PhotoBoxEmpty'

import styles from './statics/styles'

const BottomDrawerPhotos = props => {
  const { list } = props

  return (
    <Drawer overlay={true} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Share this photo in:</Text>
        <Image style={styles.closeIcon} source={require('./statics/icon-cancel.png')} />
      </View>
      <View style={styles.listContainer}>
        <PhotoBoxEmpty />
        { list.map((item, i) => (
          <PhotoWithTextBox style={styles.photoElement} key={i} photo={item.photo} text={item.text} />
        )) }
      </View>
    </Drawer>
  )
}

export default BottomDrawerPhotos