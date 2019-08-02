import React from 'react'
import {
  View,
  ViewStyle,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Modal
} from 'react-native'
import ImageZoom from 'react-native-image-pan-zoom'
import { Circle } from 'react-native-progress'
import Icon from '@textile/react-native-icon'
import {
  State,
  LongPressGestureHandler,
  TapGestureHandler,
  TapGestureHandlerStateChangeEvent,
  LongPressGestureHandlerStateChangeEvent
} from 'react-native-gesture-handler'

import Message, { Props as MessageProps } from './message'
import ProgressiveImage from './ProgressiveImage'
import LikeAndComment, {
  Props as LikeAndCommentProps
} from './like-and-comment'
import { spacing, size, color, textStyle } from '../styles'
import Comments, { Props as CommentsProps } from './comments'
import { GroupStatus } from '../features/group/file-sync/models'

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
  syncStatus?: GroupStatus
  displayError?: (message: string) => () => void
  pinchZoom?: boolean
  pinchHeight?: number
  pinchWidth?: number
  onLongPress?: () => void
}

export default class Photo extends React.PureComponent<Props> {
  state = {
    selected: false
  }

  doubleTapRef: any = React.createRef()

  onLongPress = (event: LongPressGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.state === State.ACTIVE && this.props.onLongPress) {
      this.props.onLongPress()
    }
  }

  toggleSelected = () => {
    this.setState({ selected: !this.state.selected })
  }

  onSingleTap = (event: TapGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      this.toggleSelected()
    }
  }

  onDoubleTap = (event: TapGestureHandlerStateChangeEvent) => {
    if (event.nativeEvent.state === State.ACTIVE) {
      this.props.onLike()
    }
  }

  progressiveElement(width: number, height: number, minWidth: number) {
    return (
      <LongPressGestureHandler
        onHandlerStateChange={this.onLongPress}
        minDurationMs={600}
      >
        <TapGestureHandler
          onHandlerStateChange={this.onSingleTap}
          waitFor={this.doubleTapRef}
        >
          <TapGestureHandler
            ref={this.doubleTapRef}
            onHandlerStateChange={this.onDoubleTap}
            numberOfTaps={2}
          >
            <View>
              <ProgressiveImage
                imageId={this.props.photoId}
                fileIndex={this.props.fileIndex}
                showPreview={true}
                forMinWidth={minWidth}
                style={{ width, height, overflow: 'hidden' }}
                resizeMode={'cover'}
              />
            </View>
          </TapGestureHandler>
        </TapGestureHandler>
      </LongPressGestureHandler>
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
    const proportionalWidth = w / dimW
    const proportionalHeight = h / dimH
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
		  onClick={this.toggleSelected}
        enableCenterFocus={false}
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
        {this.progressiveElement(
          this.props.photoWidth,
          this.props.photoWidth,
          this.props.photoWidth
        )}
        <LikeAndComment {...this.props} />
        <Comments {...this.props} />
      </View>
    )
  }

  renderSelection() {
    // Just uses a touchable image, when touched will enable it's own modal in full screen
    let progress: number | undefined
    if (this.props.syncStatus) {
      const { sizeComplete, sizeTotal } = this.props.syncStatus
      progress = sizeComplete / sizeTotal
    }
    return (
      <View style={CONTAINER}>
        <Modal
          animationType={'fade'}
          transparent={false}
          visible={this.state.selected}
          onRequestClose={this.toggleSelected}
        >
          {this.zoomableElement()}
        </Modal>
        <Message {...this.props} containerStyle={MESSAGE_CONTAINER} />
        {this.progressiveElement(
          this.props.photoWidth,
          this.props.photoWidth,
          this.props.photoWidth
        )}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            paddingLeft: spacing.screenEdge,
            paddingRight: spacing.screenEdge,
            paddingTop: spacing.screenEdge
          }}
        >
          <LikeAndComment {...this.props} />
          {this.props.syncStatus && !this.props.syncStatus.error && (
            <Circle
              showsText={false}
              size={size._024}
              thickness={2}
              progress={progress}
              color={color.brandBlue}
            />
          )}
          {this.props.syncStatus && this.props.syncStatus.error && (
            <TouchableOpacity
              onPress={
                this.props.displayError
                  ? this.props.displayError(this.props.syncStatus.error.reason)
                  : undefined
              }
            >
              <Icon
                name="alert-circle"
                size={size._024}
                style={{ color: color.severe_3 }}
              />
            </TouchableOpacity>
          )}
        </View>
        <Comments {...this.props} />
      </View>
    )
  }

  render() {
    if (this.props.pinchZoom) {
      return this.renderSelection()
    }
    return this.renderSimple()
  }
}
