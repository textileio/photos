import React from 'react'
import { View, Image, Text } from 'react-native'

import SmallIconTag from '../SmallIconTag'

import moment from 'moment'
import SvgUri from 'react-native-svg-uri'
const jdenticon = require('jdenticon')

import styles from './statics/styles'
import navStyles from '../../../Navigation/Styles/NavigationStyles'

const CommentCard = props => {
  // const { userName, comment, date, subComments, isSubComment, photo } = props
  const userName = props.metadata.username
  const comment = props.photo.caption
  const date = moment.utc(props.metadata.added).fromNow()
  const subComments = undefined
  const isSubComment = false

  const profile = props.profiles.find((p) => p.id === props.photo.author_id)

  let avatar = ''
  if (!profile) {
    try {
      avatar = jdenticon.toSvg(userName, 38)
    } catch (err) {}
  }

  return (
    <View style={[styles.comment, isSubComment ? styles.subComment : styles.withDivider ]}>
      <View style={styles.commentProfileImage}>
        {(profile && profile.avatar_id) &&
          <View style={styles.profileContainer}>
            <Image
              source={{uri: profile.avatar_id}}
              resizeMode={'cover'}
              style={styles.commentImage}
            />
          </View>}
        {(!profile || !profile.avatar_id) &&
          <View style={styles.profileContainer}>
            <SvgUri
              width={styles.commentImage.width}
              height={styles.commentImage.height}
              svgXmlData={avatar}
            />
          </View>}
      </View>
      <View style={styles.commentTexts}>
        <Text style={styles.commentUser}>{userName}</Text>
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
