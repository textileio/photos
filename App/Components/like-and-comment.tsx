import React from 'react'
import {
  View,
  TouchableOpacity,
  Text,
  ViewStyle,
  TextStyle,
  ImageStyle
} from 'react-native'
import Icon from '@textile/react-native-icon'

import { color, spacing, textStyle } from '../styles'
import { CommentData } from './comments';
import { ILike } from '@textile/js-types';

const ICONS: ViewStyle = {
  flexDirection: 'row'
}

const ICON: ImageStyle = {
  marginRight: spacing._008
}

const TEXT: TextStyle = {
  ...textStyle.body_m,
  color: color.grey_3,
  paddingTop: spacing._004
}

export interface Props {
  likes: ReadonlyArray<ILike>
  comments: ReadonlyArray<CommentData>
  likesAndCommentsContainerStyle?: ViewStyle
  hasLiked: boolean
  onLike: () => void
  onComment: () => void
}

const LikeAndComment = (props: Props) => {
  const {
    likes,
    comments,
    likesAndCommentsContainerStyle,
    hasLiked,
    onLike,
    onComment
  } = props
  const numberLikes = likes.length
  const numberComments = comments.length
  const likesWord = numberLikes === 0 || numberLikes > 1 ? 'likes' : 'like'
  const commentsWord =
    numberComments === 0 || numberComments > 1 ? 'comments' : 'comment'
  const displayLikesCount =
    (!hasLiked && numberLikes > 0) || (hasLiked && numberLikes > 1)
  const displayCommentsCount = numberComments > 0
  return (
    <View style={likesAndCommentsContainerStyle}>
      <View style={ICONS}>
        {hasLiked && (
          <Icon
            name="heart"
            size={24}
            style={{ ...ICON, color: color.accent2_2 }}
          />
        )}
        {!hasLiked && (
          <TouchableOpacity onPress={onLike}>
            <Icon
              name="heart"
              size={24}
              style={{ ...ICON, color: color.grey_0 }}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity onPress={onComment}>
          <Icon name="comment" size={24} style={ICON} />
        </TouchableOpacity>
      </View>
      {displayLikesCount ||
        (displayCommentsCount && (
          <Text style={TEXT}>
            {displayCommentsCount && `${numberComments} ${commentsWord}`}
            {displayLikesCount && displayCommentsCount && ` | `}
            {displayLikesCount && `${numberLikes} ${likesWord}`}
          </Text>
        ))}
    </View>
  )
}

export default LikeAndComment
