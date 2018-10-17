import React from 'react'
import moment from 'moment'
import { View, Text, TouchableOpacity } from 'react-native'
import ImageSc from 'react-native-scalable-image'
import * as NotificationServices from '../../../Services/Notifications'
import Avatar from '../../../Components/Avatar'
import TextileImage from '../../../../TextileImage'

import styles from './statics/styles'

const FeedItem = props => {
  const { notification, onClick } = props
  const date = moment(notification.date).fromNow()
  const payload = NotificationServices.toPayload(notification)

  if (!payload) {
    return (<View />)
  }

  const isPhotoType = NotificationServices.isPhoto(notification)

  const readStyle = notification.read ? {} : {borderWidth: 2, borderColor: '#ded3ff'}

  const leftSource = (
    <Avatar
      width={24}
      height={24}
      peerId={notification.actor_id}
      defaultSource={require('../../../Images/v2/main-image.png')}
      style={readStyle}
    />)

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
      <View style={{ width: 40, height: 40, overflow: 'hidden', opacity: 0.5 }}>
        {!isPhotoType && <ImageSc width={40} source={require('../../../Images/v2/unread.png')} />}
        {isPhotoType && <TextileImage style={{width: 40, height: 40}} imageId={notification.data_id} path={'thumb'} resizeMode={'cover'} />}
      </View>
    </TouchableOpacity>
  )
}

export default FeedItem
