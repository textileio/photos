import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import moment from 'moment'
import TextileImage from '../../../../TextileImage'

import IconTag from '../IconTag'
import Avatar from '../../../Components/Avatar'

import styles, { cardImageContainerStyle, cardImageStyle } from './statics/styles'

const ThreadCard = props => {
  const { name, updated, userCount, photos, onPress } = props

  let title = name
  if (title.length > 17) {
    title = title.substring(0, 32)
    title = title.substring(0, title.lastIndexOf(' '))
    while (title[title.length - 1] === '.' || title[title.length - 1] === ' ') {
      title = title.slice(0, -1)
    }
    title += '...'
  }

  const commentsCount = photos.length
  let lastUpdatedTime = moment(updated).fromNow()
  if (commentsCount === 0) {
    lastUpdatedTime = 'no activity'
  }

  return (
    <TouchableOpacity activeOpacity={0.95} style={styles.threadCard} onPress={() => {
      onPress(props)
    }}>
      <View style={styles.threadCardHeader}>
        <View style={styles.threadCardHeaderLeft}>
          <Text style={styles.threadCardTitle}>{title}</Text>
        </View>
        <View style={styles.threadCardHeaderRight}>
          <View style={styles.threadCardHeaderRightDetail}>
            <Text style={styles.detailUpdateTime}>{lastUpdatedTime}</Text>
          </View>
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
            const imageStyle = cardImageStyle(photos, i)
            return (
              <View key={i} style={[styles.imageContainer, imageStyle]}>
                <View style={styles.imageStretch}>
                  <TextileImage
                    imageId={photo.id}
                    path={'small'}
                    resizeMode={'cover'}
                    height={imageStyle.height}
                  />
                </View>
              </View>
            )
          }) }
        </View>
      </View>
      {commentsCount !== 0 && <View style={styles.threadCardFooter}>
        <View style={styles.threadCardFooterDetail}>
          <IconTag
            text={userCount}
            image={require('./statics/icon-user.png')}
          />
          <IconTag
            text={commentsCount}
            image={require('./statics/icon-photo.png')}
          />
        </View>
      </View>}
    </TouchableOpacity>
  )
}

export default ThreadCard
