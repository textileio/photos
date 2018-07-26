import React from 'react'
import { View, Image, Text } from 'react-native'

import SmallIconTag from '../SmallIconTag'

import styles from './statics/styles'

const CommentCard = props => {
  const { userName, comment, date, subComments, isSubComment, photo } = props

  return (
    <View style={[styles.comment, isSubComment ? styles.subComment : styles.withDivider ]}>
      <Image style={styles.commentImage} source={photo} />
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