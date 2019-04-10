import React from 'react'
import moment from 'moment'
import { View, Text, TouchableOpacity } from 'react-native'
import * as NotificationServices from '../../../Services/Notifications'
import Avatar from '../../../Components/Avatar'
import TextileImage from '../../../Components/TextileImage'

import styles from './statics/styles'
import { color } from '../../../styles'
import { Notification } from '../../../Models/Notifications'

interface FeedItemProps {
  notification: Notification
  onClick: (notification: Notification) => void
}

const FeedItem = (props: FeedItemProps) => {
  const { notification, onClick } = props
  const date = moment(notification.date).fromNow()
  const payload = NotificationServices.toPayload(notification)
  const clickFunction = () => { onClick(notification) }
  if (!payload) {
    return (<View />)
  }

  const photoId = NotificationServices.getPhotoId(notification)

  const readStyle = notification.read ? {
    width: 29,
    height: 29,
    borderRadius: 16
  } : {
    width: 29,
    height: 29,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 28, 63, 0.2)'
  }

  const leftSource = (
    <View
      style={{...readStyle, justifyContent: 'center', alignItems: 'center', alignContent: 'center'}}
    >
      <Avatar
        style={{ width: '100%', height: '100%', borderRadius: 16, backgroundColor: color.grey_5 }}
        target={notification.avatar}
      />
    </View>
  )

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={styles.itemContainer}
      onPress={clickFunction}
    >
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
        {/* TODO: Update textile image props to target and index */}
        {photoId && <TextileImage
          style={{width: 40, height: 40}}
          target={photoId}
          index={0}
          forMinWidth={40}
          resizeMode={'cover'}
        />}
      </View>
    </TouchableOpacity>
  )
}

export default FeedItem
