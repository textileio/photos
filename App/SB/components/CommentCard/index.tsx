import React from 'react'
import { View, Text } from 'react-native'

import moment from 'moment'
import Avatar from '../../../Components/Avatar'

import styles from './statics/styles'

export type Props = {
  username: string
  avatarUri?: string,
  comment: string
  date: string
  isSubComment: boolean
  subComments: Props[]
}

const CommentCard = (props: Props) => {
  // const uri = props.photo.author_id ? 'https://cafe.us-east-1.textile.io/ipns/' + props.photo.author_id + '/avatar' : undefined
  // const username =  props.photo.username ? props.photo.username : props.photo.author_id.substring(0, 8).toUpperCase()

  const { username, avatarUri, comment, date, subComments, isSubComment } = props
  const dateString = moment.utc(date).fromNow()
  const defaultSource = require('../../views/Settings/statics/main-image.png')
  return (
    <View style={[styles.comment, isSubComment ? styles.subComment : styles.withDivider ]}>
      <Avatar style={{marginRight: 11}} width={38} height={38} uri={avatarUri} defaultSource={defaultSource} />
      <View style={styles.commentTexts}>
        <Text style={styles.commentUser}>{username}</Text>
        <View style={styles.commentTextWrapper}><Text style={styles.commentText}>{comment}</Text></View>
        { subComments && subComments.map((subComment, i) => (
          <CommentCard key={i} isSubComment {...subComment} />
        ))}
      </View>
      { !isSubComment && <Text style={styles.commentDate}>{dateString}</Text> }
    </View>
  )
}

export default CommentCard
