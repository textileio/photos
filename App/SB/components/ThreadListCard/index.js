import React from 'react'
import { View, Text, TouchableOpacity, Dimensions } from 'react-native'
import moment from 'moment'
import TextileImage from '../../../Components/TextileImage'

import styles, { cardImageContainerStyle, cardImageStyle } from './statics/styles'

const { width } = Dimensions.get('window')

const ThreadCard = props => {
  const { name, updated, photos, onPress } = props

  const commentsCount = photos.length
  const status = commentsCount === 0 ? 'Click to add a photo' : 'Updated ' + moment(updated).fromNow()

  const displayName = name === 'default' ? 'Your Textile Photos' : name

  return (
    <TouchableOpacity activeOpacity={0.95} style={styles.threadCard} onPress={() => {
      onPress(props)
    }}>
      <View style={styles.threadCardHeader}>
        <View style={styles.threadCardHeaderLeft}>
          <Text numberOfLines={2} style={styles.threadCardTitle}>{displayName}</Text>
        </View>
      </View>
      <View style={styles.threadCardBody}>
        <View style={cardImageContainerStyle(photos)}>
          { photos.length > 3 && (
            <View style={styles.moreImages}>
              <Text style={styles.moreImagesText}>{photos.length - 3}+</Text>
            </View>
          )}

          { photos.map((photo, i) => {
            const imageStyle = cardImageStyle(photos, i, width)
            return (
              <View key={i} style={[styles.imageContainer, imageStyle]}>
                <View style={styles.imageStretch}>
                  <TextileImage
                    imageId={photo.id}
                    forMinWidth={imageStyle.width}
                    resizeMode={'cover'}
                    style={{height: imageStyle.height}}
                  />
                </View>
              </View>
            )
          }) }
        </View>
      </View>
      <View style={styles.threadCardFooter}>
        <View style={styles.threadCardFooterRight}>
          <View style={styles.threadCardFooterRightDetail}>
            <Text style={styles.detailUpdateTime}>{status}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default ThreadCard
