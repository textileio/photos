import React from 'react'
import propTypes from 'prop-types'
import { View, Image, Text } from 'react-native'
import TextileImage from '../../../../TextileImage'

import styles from './statics/styles'

const PhotoWithTextBox = props => {
  const { item, text, style } = props

  return (
    <View style={[styles.itemContainer, style]}>
      {item &&
        <TextileImage
          imageId={item.photo.id}
          path={'thumb'}
          style={styles.itemPhoto}
          resizeMode={'contain'}
          capInsets={'true'}
        />
      }
      {!item &&
        <Image style={styles.itemPhoto} />
      }
      <Text style={styles.itemText}>{text}</Text>
    </View>
  )
}

PhotoWithTextBox.propTypes = {
  photo: propTypes.number,
  text: propTypes.string.isRequired
}

export default PhotoWithTextBox
