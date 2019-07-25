import React from 'react'
import { View, Text, TouchableWithoutFeedback } from 'react-native'

import moment from 'moment'
import Avatar from '../../../Components/Avatar'

import styles from './statics/styles'

export interface Props {
  username: string
  avatar?: string
  comment: string
  date: Date
  isCaption: boolean
  onLongPress?: () => void
}

const CommentCard = (props: Props) => {
  const { username, avatar, comment, date, isCaption } = props
  const dateString = moment.utc(date).fromNow()
  return (
    <TouchableWithoutFeedback
      style={[styles.container, isCaption ? styles.withDivider : {}]}
      onLongPress={props.onLongPress}
    >
      <View style={styles.content}>
        <Avatar
          style={{ marginRight: 11, width: 38, height: 38 }}
          target={avatar}
        />
        <View style={styles.commentTexts}>
          <Text style={styles.commentUser}>{username}</Text>
          <View style={styles.commentTextWrapper}>
            <Text style={styles.commentText}>{comment}</Text>
          </View>
          <Text style={styles.commentDate}>{dateString}</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  )
}

export default CommentCard
