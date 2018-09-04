import React from 'react'
import { View, Text } from 'react-native'

import moment from 'moment'
import Avatar from '../../../Components/Avatar'

import styles from './statics/styles'

export type Props = {
  username: string
  peerId?: string,
  comment: string
  date: string
  isCaption: boolean
}

const CommentCard = (props: Props) => {
  const { username, peerId, comment, date, isCaption } = props
  const dateString = moment.utc(date).fromNow()
  const defaultSource = require('../../views/Settings/statics/main-image.png')
  return (
    <View style={[styles.comment, isCaption ? styles.withDivider : {} ]}>
      <Avatar style={{marginRight: 11}} width={38} height={38} peerId={peerId} defaultSource={defaultSource} />
      <View style={styles.commentTexts}>
        <Text style={styles.commentUser}>{username}</Text>
        <View style={styles.commentTextWrapper}><Text style={styles.commentText}>{comment}</Text></View>
        <Text style={styles.commentDate}>{dateString}</Text>
      </View>
    </View>
  )
}

export default CommentCard
