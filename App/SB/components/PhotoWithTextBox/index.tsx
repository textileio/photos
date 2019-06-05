import React from 'react'
import propTypes from 'prop-types'
import { View, Image, Text, ViewStyle } from 'react-native'
import TextileImage from '../../../Components/TextileImage'

import styles from './statics/styles'
import { IFiles } from '@textile/react-native-sdk'

interface PhotoWithTextBoxProps {
  text: string
  photo?: IFiles
  style?: ViewStyle
}

const PhotoWithTextBox = (props: PhotoWithTextBoxProps) => {
  const { photo, text, style } = props

  return (
    <View style={[styles.itemContainer, style]}>
      {photo && (
        <View style={styles.item}>
          <View style={styles.itemBackgroundContainer}>
            {photo && (
              <TextileImage
                target={photo.target}
                index={photo.files[0].index}
                forMinWidth={70}
                style={{ width: 70, height: 50 }}
                resizeMode={'cover'}
                capInsets={'true'}
              />
            )}
          </View>
        </View>
      )}
      {!photo && (
        <View style={styles.itemBox}>
          <Image
            style={styles.itemBoxPlus}
            source={require('../PhotoBoxEmpty/statics/icon-big-plus.png')}
          />
        </View>
      )}
      <Text numberOfLines={1} style={styles.itemText}>
        {text}
      </Text>
    </View>
  )
}

export default PhotoWithTextBox
