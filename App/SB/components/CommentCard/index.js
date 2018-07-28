import React from 'react'
import { View, Image, Text } from 'react-native'

import SmallIconTag from '../SmallIconTag'

import moment from 'moment'
import SvgUri from 'react-native-svg-uri'
const jdenticon = require('jdenticon')

import styles from './statics/styles'

const CommentCard = props => {
  // const { userName, comment, date, subComments, isSubComment, photo } = props
  const userName = props.metadata.username
  const comment = props.photo.caption
  const date = moment.utc(props.metadata.added).fromNow()
  const subComments = undefined
  const isSubComment = false

  let avatar = ''
  try {
    avatar = jdenticon.toSvg(userName, 38)
  } catch (err) {}

  return (
    <View style={[styles.comment, isSubComment ? styles.subComment : styles.withDivider ]}>
      {/*<Image style={styles.commentImage} source={photo} />*/}
      <View style={styles.commentImage}>
        <SvgUri
          width={styles.commentImage.width}
          height={styles.commentImage.height}
          svgXmlData={avatar}
        />
      </View>
      <View style={styles.commentTexts}>
        <Text style={styles.commentUser}>{userName}</Text>
        <Text style={styles.commentText}>{comment}</Text>
        <SmallIconTag textStyle={styles.commentIconLabel} image={require('./statics/icon-comment.png')} text='Reply comment' />
        { subComments && subComments.map((subComment, i) => (
          <CommentCard key={i} isSubComment={true} {...subComment} />
        ))}
      </View>
      { !isSubComment && <Text style={styles.commentDate}>{date}</Text> }
    </View>
  )
}

export default CommentCard
