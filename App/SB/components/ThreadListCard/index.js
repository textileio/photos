import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import moment from 'moment'
import TextileImage from '../../../../TextileImage'

import IconTag from '../IconTag'
import Avatar from '../../../Components/Avatar'

import styles, { cardImageContainerStyle, cardImageStyle } from './statics/styles'

const ThreadCard = props => {
  const { name, latestPeerId, updated, userCount, photos, onPress } = props
  const lastUpdatedTime = moment(updated).fromNow()
  const commentsCount = photos.length
  console.log('ooo', photos)
  return (
    <TouchableOpacity activeOpacity={0.8} style={styles.threadCard} onPress={() => {
      onPress(props)
    }}>
      <View style={styles.threadCardHeader}>
        <View style={styles.threadCardHeaderLeft}>
          <Text style={styles.threadCardTitle}>{name}</Text>
          <View style={styles.threadCardHeaderLeftDetail}>
            <Text style={styles.detailUpdateTime}>{lastUpdatedTime}</Text>
            <IconTag
              text={userCount}
              image={require('./statics/icon-user.png')}
            />
            <IconTag
              text={commentsCount}
              image={require('./statics/icon-comment.png')}
            />
          </View>
        </View>
        <View style={styles.threadCardHeaderRight}>
          <Avatar width={48} height={48} uri={latestPeerId} defaultSource={require('../../views/Settings/statics/main-image.png')} />
        </View>
      </View>
      <View style={styles.threadCardBody}>
        <View style={cardImageContainerStyle(photos)}>
          { photos.length > 3 && (
            <View style={styles.moreImages}>
              <Text style={styles.moreImagesText}>{photos.length - 3}+</Text>
            </View>
          )}

          { photos.map((item, i) => {
            const imageStyle = cardImageStyle(photos, i)
            return (
              <View key={i} style={[styles.imageContainer, imageStyle]}>
                <View style={styles.imageStretch}>
                  <TextileImage
                    imageId={item.photo.id}
                    path={'thumb'}
                    resizeMode={'cover'}
                    height={imageStyle.height}
                  />
                </View>
              </View>
            )
          }) }
        </View>
      </View>
    </TouchableOpacity>
  )
}

export default ThreadCard
