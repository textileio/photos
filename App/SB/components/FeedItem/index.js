import React from 'react'
import moment from 'moment'
import { View, Text, TouchableOpacity } from 'react-native'
import ImageSc from 'react-native-scalable-image'
import * as NotificationServices from '../../../Services/Notifications'
import Avatar from '../../../Components/Avatar'
import TextileImage from '../../../Components/TextileImage'

import styles from './statics/styles'

const FeedItem = props => {
  const { notification, onClick } = props
  const date = moment(notification.date).fromNow()
  const payload = NotificationServices.toPayload(notification)

  if (!payload) {
    return (<View />)
  }

  const isPhotoType = NotificationServices.isPhoto(notification)

  const readStyle = notification.read ? {
    width: 29,
    height: 29,
    borderRadius: 16
  } : {
    width: 29,
    height: 29,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#dbc5d2'
  }

  const leftSource = (
    <View
      style={{...readStyle, justifyContent: 'center', alignItems: 'center', alignContent: 'center'}}
    >
      <Avatar
        width={24}
        height={24}
        peerId={notification.actor_id}
        defaultSource={require('../../../Images/v2/main-image.png')}
      />
    </View>
  )

  return (
    <TouchableOpacity activeOpacity={0.6} style={styles.itemContainer} onPress={() => {
      onClick(notification)
    }}>
      <View style={styles.headerIconUser}>
        <View style={styles.iconContainer}>
          {leftSource}
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{payload.feed}</Text>
        <Text style={[styles.timestamp, !notification.read && styles.unread]}>{date}</Text>
      </View>
      <View style={{ width: 40, height: 40, overflow: 'hidden' }}>
        {isPhotoType && <TextileImage style={{width: 40, height: 40}} imageId={notification.photoId} forMinWidth={40} resizeMode={'cover'} />}
      </View>
    </TouchableOpacity>
  )
}

export default FeedItem
