import React, { Component } from 'react'
import { View, ViewStyle, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'

import Message, { Props as MessageProps } from './message'
import ProgressiveImage from './ProgressiveImage'
import LikeAndComment, { Props as LikeAndCommentProps } from './like-and-comment'
import { spacing } from '../styles'
import Comments, { Props as CommentsProps } from './comments'

const CONTAINER: ViewStyle = {
  paddingTop: spacing._016,
  paddingBottom: spacing._016
}

const MESSAGE_CONTAINER: ViewStyle = {
  paddingTop: spacing._000,
  paddingBottom: spacing._008
}

interface Props extends MessageProps, LikeAndCommentProps, CommentsProps {
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
        <LikeAndComment {...this.props} />
        <Comments {...this.props} />
      </View>

    )
  }
}

export default connect(undefined, undefined)(Photo)
