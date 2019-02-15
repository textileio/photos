import React, { Component } from 'react'
import { View, ViewStyle, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'

import Message, { Props as MessageProps } from './message'
import ProgressiveImage from './ProgressiveImage'
import LikeAndComment from './like-and-comment'
import { spacing } from '../styles'

const CONTAINER: ViewStyle = {
  paddingTop: spacing._012,
  paddingBottom: spacing._012
}

const MESSAGE_CONTAINER: ViewStyle = {
  paddingBottom: spacing._008
}

interface Props extends MessageProps {
  photoId: string
  fileIndex: number
  photoWidth: number
}

class Photo extends Component<Props> {
  state = {  }

  render() {
    return (
      <View style={CONTAINER}>
        <Message {...this.props} containerStyle={MESSAGE_CONTAINER} />
        <ProgressiveImage
          imageId={this.props.photoId}
          fileIndex={this.props.fileIndex}
          showPreview={true}
          forMinWidth={this.props.photoWidth}
          style={{ width: this.props.photoWidth, height: this.props.photoWidth }}
          resizeMode={'cover'}
        />
        <LikeAndComment hasLiked={true} numberLikes={2} onLike={() => console.log('liked')} onComment={() => console.log('commented')} />
      </View>

    )
  }
}

export default connect(undefined, undefined)(Photo)
