import React from 'react'
import { View, Image, Text, ViewStyle } from 'react-native'
import TextileImage from '../../../Components/TextileImage'

import styles from './statics/styles'
import { IFiles } from '@textile/react-native-sdk'

interface PhotoWithTextBoxProps {
  text: string
  photo?: IFiles
  hash?: string
  style?: ViewStyle
}

const PhotoWithTextBox = (props: PhotoWithTextBoxProps) => {
  const { photo, hash, text, style } = props

  const chooseContainer = () => {
    if (photo) {
      return (
        <View style={styles.item}>
          <View style={styles.itemBackgroundContainer}>
            <TextileImage
              target={photo.data}
              index={photo.files[0].index}
              forMinWidth={70}
              style={{ width: 70, height: 50 }}
              resizeMode={'cover'}
              capInsets={'true'}
            />
          </View>
        </View>
      )
    } else if (hash) {
      return (
        <View style={styles.item}>
          <View style={styles.itemBackgroundContainer}>
            <TextileImage
              target={hash}
              index={0}
              forMinWidth={70}
              style={{ width: 70, height: 50 }}
              resizeMode={'cover'}
              capInsets={'true'}
            />
          </View>
        </View>
      )
    }
    return (
      <View style={styles.itemBox}>
        <Image
          style={styles.itemBoxPlus}
          source={require('../PhotoBoxEmpty/statics/icon-big-plus.png')}
        />
      </View>
    )
  }
  return (
    <View style={[styles.itemContainer, style]}>
      {chooseContainer()}
      <Text numberOfLines={1} style={styles.itemText}>
        {text}
      </Text>
    </View>
  )
}

export default PhotoWithTextBox
