import React from 'react'
import { View, TouchableOpacity, Text, ViewStyle, TextStyle, ImageStyle } from 'react-native'
import Icon from '@textile/react-native-icon'

import { color, spacing, textStyle } from '../styles'

const CONTAINER: ViewStyle = {
  paddingLeft: spacing.screenEdge,
  paddingRight: spacing.screenEdge,
  paddingTop: spacing.screenEdge
}

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
  likesAndCommentsContainerStyle?: ViewStyle
  hasLiked: boolean
  numberLikes: number
  onLike: () => void
  onComment: () => void
}

const LikeAndComment = (props: Props) => {
  const { likesAndCommentsContainerStyle, hasLiked, numberLikes, onLike, onComment } = props
  const likesWord = numberLikes === 0 || numberLikes > 1 ? 'likes' : 'like'
  return (
    <View style={[CONTAINER, likesAndCommentsContainerStyle]}>
      <View style={ICONS}>
        {hasLiked &&
          <Icon name='heart' size={24} style={{ ...ICON, color: color.accent2_2 }} />
        }
        {!hasLiked &&
          <TouchableOpacity onPress={onLike}>
            <Icon name='heart' size={24} style={{ ...ICON, color: color.grey_0 }} />
          </TouchableOpacity>
        }
        <TouchableOpacity onPress={onComment} >
          <Icon name='comment' size={24} style={ICON} />
        </TouchableOpacity>
      </View>
      {((!hasLiked && numberLikes > 0) || (hasLiked && numberLikes > 1)) &&
        <Text style={TEXT}>{`${numberLikes} ${likesWord}`}</Text>
      }
    </View>

  )
}

export default LikeAndComment
