import React from 'react'
import { View, Image, Text } from 'react-native'

import SmallIconTag from '../SmallIconTag'

import styles, { cardImageContainerStyle, cardImageStyle } from './statics/styles'

const ThreadCard = props => {
  const { title, userProfilePicture, lastUpdatedTime, commentsQty, usersQty, photos } = props

  return (
    <View style={styles.threadCard}>
      <View style={styles.threadCardHeader}>
        <View style={styles.threadCardHeaderLeft}>
          <Text style={styles.threadCardTitle}>{title}</Text>
          <View style={styles.threadCardHeaderLeftDetail}>
            <Text style={styles.detailUpdateTime}>{lastUpdatedTime}</Text>
            <SmallIconTag
              text={usersQty}
              image={require('./statics/icon-user.png')}
            />
            <SmallIconTag
              text={commentsQty}
              image={require('./statics/icon-comment.png')}
            />
          </View>
        </View>
        <View style={styles.threadCardHeaderRight}>
          <Image source={userProfilePicture} />
        </View>
      </View>
      <View style={styles.threadCardBody}>
        <View style={cardImageContainerStyle(photos)}>
          { photos.length > 3 && (
            <View style={styles.moreImages}>
              <Text style={styles.moreImagesText}>{photos.length - 3}+</Text>
            </View>
          )}

          { photos.map((item, i) => (
            <Image key={i} style={cardImageStyle(photos, i)} source={item.image} />
          )) }
        </View>
      </View>
    </View>
  )
}

export default ThreadCard