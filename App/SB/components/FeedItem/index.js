import React from 'react'
import moment from 'moment'
import { View, Text, TouchableOpacity } from 'react-native'
import Config from 'react-native-config'
import ImageSc from 'react-native-scalable-image'
import * as NotificationServices from '../../../Services/Notifications'
import Avatar from '../../../Components/Avatar'
import styles from './statics/styles'
import TextileImage from '../../../../TextileImage'

const FeedItem = props => {
  const { notification, onClick } = props
  const date = moment(notification.date).fromNow()
  const payload = NotificationServices.toPayload(notification)

  if (!payload) return (<View />)

  const avatarUri = notification.actor_id ? Config.TEXTILE_CAFE_URI + '/ipns/' + notification.actor_id + '/avatar' : undefined

  const isPhotoType = NotificationServices.isPhoto(notification)

  const leftSource = (
    <Avatar
      width={24}
      height={24}
      uri={avatarUri}
      defaultSource={require('../../../Images/v2/main-image.png')}
    />)

  return (
    <TouchableOpacity style={styles.itemContainer} onPress={() => {
      onClick(notification)
    }}>
      <View style={styles.headerIconUser}>
        <View style={styles.iconContainer}>
          {leftSource}
        </View>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text}>{payload.message}</Text>
        <Text style={[styles.timestamp, !notification.read && styles.unread]}>{date}</Text>
      </View>
      {!notification.read && !isPhotoType && <ImageSc width={40} source={require('../../../Images/v2/unread.png')} />}
      {!notification.read && isPhotoType && <TextileImage width={40} height={40} imageId={notification.data_id} path={'thumb'} resizeMode={'cover'} />}
      {notification.read && isPhotoType && <TextileImage width={40} height={40} imageId={notification.data_id} path={'thumb'} resizeMode={'cover'} ><View style={styles.readImage}></View></TextileImage>}
    </TouchableOpacity>
  )
}

export default FeedItem
