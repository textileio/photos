import React from 'react'
import propTypes from 'prop-types'
import { View, Image } from 'react-native'
import ImageSc from 'react-native-scalable-image'

import styles, { gridStyles } from './statics/styles'

const PhotoGrid = props => {
  const { type, photos } = props

  return (
    <View style={[ styles.photoList, gridStyles(photos)[type].container ]}>
      { photos.map((item, i) =>
        <View key={i} style={styles.photo}>
          { item.selected && [
            <View key='selected-1' style={styles.photoSelected} />,
            <Image key='selected-2' style={styles.photoSelectedIcon} source={require('./statics/icon-ok.png')} />
          ]}
          <ImageSc width={gridStyles(photos)[type].photo} source={item.photo} />
        </View>
      )}
    </View>
  )
}

PhotoGrid.propTypes = {
  type: propTypes.oneOf(['grid', 'list'])
}

export default PhotoGrid
