import React, { Component } from 'react'
import { View, ViewStyle, TouchableOpacity, Dimensions, Modal } from 'react-native'
import { connect } from 'react-redux'

import Message, { Props as MessageProps } from './message'
import ProgressiveImage from './ProgressiveImage'
import LikeAndComment, { Props as LikeAndCommentProps } from './like-and-comment'
import { spacing } from '../styles'
import Comments, { Props as CommentsProps } from './comments'
import ImageZoom from 'react-native-image-pan-zoom'

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
  pinchZoom?: boolean
  pinchHeight?: number
  pinchWidth?: number
}

class Photo extends Component<Props> {
  state = {
    selected: false
  }

  toggleSelected = () => {
    this.setState({selected: !this.state.selected})
  }

  progressiveElement(width: number, height: number, minWidth) {
    return (
      <ProgressiveImage
        imageId={this.props.photoId}
        fileIndex={this.props.fileIndex}
        showPreview={true}
        forMinWidth={minWidth}
        style={{ width, height, overflow: 'hidden' }}
        resizeMode={'cover'}
      />
    )
  }

  zoomableElement() {
    // Width and height should be supplied from metadata
    const w = this.props.pinchWidth || this.props.photoWidth
    const h = this.props.pinchHeight || this.props.photoWidth

    // Get screen dimensions
    const dimW = Dimensions.get('window').width
    const dimH = Dimensions.get('window').height

    // Figure out our greatest disproportional direction
    const proportionalWidth = w/dimW
    const proportionalHeight = h/dimH
    const multiplier = 1 / Math.max(proportionalHeight, proportionalWidth)

    // Get our display dimensions
    const finalWidth = w * multiplier
    const finalHeight = h * multiplier

    return (
      <ImageZoom
        cropWidth={dimW}
        cropHeight={dimH}
        imageWidth={finalWidth}
        imageHeight={finalHeight}
        minScale={0.9}
        maxScale={2.5}
        enableCenterFocus={false}
        onClick={this.toggleSelected}
        clickDistance={1}
      >
        <View
          style={{
            backgroundColor: 'white',
            flex: 1,
            justifyContent: 'center'
          }}
        >
          {this.progressiveElement(finalWidth, finalHeight, w * 2)}
        </View>
      </ImageZoom>
    )
  }

  renderSimple() {
    return (
      <View style={CONTAINER}>
        <Message {...this.props} containerStyle={MESSAGE_CONTAINER} />
          {this.progressiveElement(this.props.photoWidth, this.props.photoWidth, this.props.photoWidth)}
        <LikeAndComment {...this.props} />
        <Comments {...this.props} />
      </View>
    )
  }

  renderSelection() {
    // Just uses a touchable image, when touched will enable it's own modal in full screen
    return (
      <TouchableOpacity 
        style={CONTAINER} 
        activeOpacity={1} 
        onPress={this.toggleSelected}>
        <Modal
          animationType={'fade'}
          transparent={false}
          visible={this.state.selected}
        >
          {this.zoomableElement()}
        </Modal>
        <Message {...this.props} containerStyle={MESSAGE_CONTAINER} />
         {this.progressiveElement(this.props.photoWidth, this.props.photoWidth, this.props.photoWidth)}
        <LikeAndComment {...this.props} />
        <Comments {...this.props} />
      </TouchableOpacity>
    )
  }

  render() {
    if (this.props.pinchZoom){
      return this.renderSelection()
    } 
    return this.renderSimple()
  }
}

export default connect(undefined, undefined)(Photo)
