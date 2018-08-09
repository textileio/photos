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
      <View style={styles.item}>
        <View style={styles.itemBackgroundContainer}>
          <TextileImage
            imageId={item.photo.id}
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
      {(!item || !item.photo) &&
        <View style={styles.itemBox}>
          <Image style={styles.itemBoxPlus} source={require('../PhotoBoxEmpty/statics/icon-big-plus.png')} />
        </View>
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
