import React from 'react'
import propTypes from 'prop-types'
import { View, Image, Text } from 'react-native'
import TextileImage from '../../../../TextileImage'

import styles from './statics/styles'

const PhotoWithTextBox = props => {
  const { photo, text, style } = props

  return (
    <View style={[styles.itemContainer, style]}>
      {photo &&
      <View style={styles.item}>
        <View style={styles.itemBackgroundContainer}>
          <TextileImage
            imageId={photo.id}
            path={'small'}
            style={styles.itemPhoto}
            width={70}
            height={50}
            resizeMode={'cover'}
            capInsets={'true'}
          />
        </View>
      </View>
      }
      {(!photo) &&
        <View style={styles.itemBox}>
          <Image style={styles.itemBoxPlus} source={require('../PhotoBoxEmpty/statics/icon-big-plus.png')} />
        </View>
      }
      <Text style={styles.itemText}>{text}</Text>
    </View>
  )
}

PhotoWithTextBox.propTypes = {
  photo: propTypes.object.isRequired,
  text: propTypes.string.isRequired
}

export default PhotoWithTextBox
