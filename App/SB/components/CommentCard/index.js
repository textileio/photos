import React from 'react'
import { View, Image, Text } from 'react-native'

import SmallIconTag from '../SmallIconTag'

import moment from 'moment'
import SvgUri from 'react-native-svg-uri'
import Avatar from '../../../Components/Avatar'

import styles from './statics/styles'
import navStyles from '../../../Navigation/Styles/NavigationStyles'

const CommentCard = props => {
  // const { userName, comment, date, subComments, isSubComment, photo } = props
  const comment = props.photo.caption
  const date = moment.utc(props.photo.date).fromNow()
  const subComments = undefined
  const isSubComment = false

  const username =  props.photo.username ? props.photo.username : props.photo.author_id.substring(0, 8).toUpperCase()
  const defaultSource = require('../../views/Settings/statics/main-image.png')
  const uri = props.metadata.peer_id ? 'https://cafe.us-east-1.textile.io/ipns/' + props.metadata.peer_id + '/avatar' : undefined

  return (
    <View style={[styles.comment, isSubComment ? styles.subComment : styles.withDivider ]}>
      <Avatar style={{marginRight: 11}} width={38} height={38} uri={uri} defaultSource={defaultSource} />
      <View style={styles.commentTexts}>
        <Text style={styles.commentUser}>{username}</Text>
        <View style={styles.commentTextWrapper}><Text style={styles.commentText}>{comment}</Text></View>
        {/*<SmallIconTag textStyle={styles.commentIconLabel} image={require('./statics/icon-comment.png')} text='Reply comment' />*/}
        { subComments && subComments.map((subComment, i) => (
          <CommentCard key={i} isSubComment={true} {...subComment} />
        ))}
      </View>
      { !isSubComment && <Text style={styles.commentDate}>{date}</Text> }
    </View>
  )
}

export default CommentCard
