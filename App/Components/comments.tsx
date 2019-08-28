import React from 'react'
import {
  View,
  ViewStyle,
  TouchableOpacity,
  TouchableWithoutFeedback,
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

const MARGIN_BAR: ViewStyle = {
  width: 4,
  marginTop: 6,
  marginLeft: 2,
  marginRight: 8,
  borderRadius: 3
}

// Uses text in order to nicely match the line-height when 1 comment.
const MARGIN_BAR_FILL: TextStyle = {
  ...textStyle.body_m,
  lineHeight: 10,
  flex: 1,
  flexDirection: 'row',
  flexWrap: 'wrap',
  overflow: 'visible',
  paddingTop: spacing._008,
  backgroundColor: color.grey_5,
  color: 'rgba(0,0,0,0)'
}

export interface CommentData {
  id: string
  username: string
  body: string
  date?: string
  onLongPress?: () => void
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
        <TouchableWithoutFeedback
          key={commentData.id}
          onLongPress={commentData.onLongPress}
        >
          <KeyValueText
            keyString={commentData.username}
            value={commentData.body}
          />
        </TouchableWithoutFeedback>
      )
    })
  return (
    <View style={[CONTAINER, props.commentsContainerStyle]}>
      {props.comments.length > 0 && (
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={MARGIN_BAR}>
            <Text style={MARGIN_BAR_FILL}>0</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'column' }}>{comments}</View>
        </View>
      )}
      {displayCount < props.comments.length && (
        <TouchableOpacity onPress={props.onViewComments}>
          <Text style={VIEW_ALL}>{`See all ${
            props.comments.length
          } comments...`}</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

export default Comments
