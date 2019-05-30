import React from 'react'
import {
  View,
  ViewStyle,
  TouchableOpacity,
  Text,
  TextStyle
} from 'react-native'

import KeyValueText from './KeyValueText'
import { spacing, textStyle, color } from '../styles'

const CONTAINER: ViewStyle = {
  paddingLeft: spacing.screenEdge,
  paddingRight: spacing.screenEdge
}

const VIEW_ALL: TextStyle = {
  ...textStyle.body_m,
  color: color.grey_3,
  marginTop: spacing._008
}

export interface CommentData {
  id: string
  username: string
  body: string
  date?: string
}

export interface Props {
  comments: ReadonlyArray<CommentData>
  commentsContainerStyle?: ViewStyle
  commentsDisplayMax?: number
  onViewComments?: () => void
}

const Comments = (props: Props) => {
  const displayCount = props.commentsDisplayMax || props.comments.length
  const index =
    props.comments.length - Math.min(displayCount, props.comments.length)
  const comments = props.comments
    .slice()
    .reverse()
    .slice(index, index + displayCount)
    .map(commentData => {
      return (
        <KeyValueText
          key={commentData.id}
          keyString={commentData.username}
          value={commentData.body}
        />
      )
    })
  return (
    <View style={[CONTAINER, props.commentsContainerStyle]}>
      {displayCount < props.comments.length && (
        <TouchableOpacity onPress={props.onViewComments}>
          <Text style={VIEW_ALL}>{`See all ${
            props.comments.length
          } comments...`}</Text>
        </TouchableOpacity>
      )}
      {comments}
    </View>
  )
}

export default Comments
