import React from 'react'
import { Animated } from 'react-native'
import {
  PanGestureHandler,
  PinchGestureHandler,
  State
} from 'react-native-gesture-handler'
import ProgressiveImage from './ProgressiveImage'
import styles from './Styles/PinchableImageStyles'

export class PinchableImage extends React.Component {
  panRef = React.createRef()
  pinchRef = React.createRef()

  constructor(props) {
    super(props)

    /* Pinching */
    this._baseScale = new Animated.Value(1)
    this._pinchScale = new Animated.Value(1)
    this._zIndex = 0
    /* Final translation */
    this._translateX = new Animated.Value(0)
    this._translateY = new Animated.Value(0)
    this._scale = Animated.multiply(this._baseScale, this._pinchScale)

    const maxScale = 2.5
    this._onPinchGestureEvent = event => {
      const newScale = Math.min(Math.max(1, event.nativeEvent.scale), maxScale + 1)
      this._syncScale = newScale
      this._pinchScale.setValue(newScale)
    }

    this._onPanGestureEvent = Animated.event(
      [
        {
          nativeEvent: {
            translationX: this._translateX,
            translationY: this._translateY
          }
        }
      ],
      { useNativeDriver: false }
    )
  }

  _onPinchHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._baseScale.setValue(1)
      this._pinchScale.setValue(1)
      this._zIndex = 0
    } else {
      this._zIndex = 100
    }
  }

  _onPanHandlerStateChange = event => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      this._translateX.setValue(0)
      this._translateY.setValue(0)
    }
  }

  render() {
    return (
      <PanGestureHandler
        onGestureEvent={this._onPanGestureEvent.bind(this)}
        onHandlerStateChange={this._onPanHandlerStateChange.bind(this)}
        ref={this.panRef}
        minPointers={2}
        minDist={0}
        minDeltaX={0}
        avgTouches={true}
      >
      <PinchGestureHandler
        ref={this.pinchRef}
        simultaneousHandlers={this.rotationRef}
        onGestureEvent={this._onPinchGestureEvent.bind(this)}
        onHandlerStateChange={this._onPinchHandlerStateChange.bind(this)}
        simultaneousHandlers={this.panRef}
      >
        <Animated.View
          style={[
            styles.pinchableImage,
            {
              transform: [
                { scale: this._scale },
                { translateX: this._translateX },
                { translateY: this._translateY }
              ]
            }
            ]}
            collapsable={false}
          >
          <ProgressiveImage
            imageId={this.props.imageId}
            showPreview={true}
            forMinWidth={this.props.forMinWidth}
            resizeMode={'cover'}
            style={{...this.props.style, zIndex: this._zIndex}}
          />
        </Animated.View>
      </PinchGestureHandler>
      </PanGestureHandler>
    )
  }
}

export default PinchableImage
