import React from 'react'
import moment from 'moment'
import { View, Text, TouchableOpacity } from 'react-native'
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

  const isPhotoType = NotificationServices.isPhoto(notification)

  const leftSource = (
    <Avatar
      width={24}
      height={24}
      peer_id={notification.actor_id}
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
      <View style={{width: 40, height: 40, overflow: 'hidden'}}>
        {!notification.read && !isPhotoType && <ImageSc width={40} source={require('../../../Images/v2/unread.png')} />}
        {!notification.read && isPhotoType && <TextileImage width={40} height={40} imageId={notification.data_id} path={'thumb'} resizeMode={'cover'} />}
        {notification.read && isPhotoType && <TextileImage width={40} height={40} imageId={notification.data_id} path={'thumb'} resizeMode={'cover'} ><View style={styles.readImage}></View></TextileImage>}
      </View>
    </TouchableOpacity>
  )
}

export default FeedItem
