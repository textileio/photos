import React, { Component } from 'react'
import { View, Animated, LayoutChangeEvent } from 'react-native'
import PropTypes from 'prop-types'

import styles from './statics/styles'

interface UnderlineProps {
  duration: number
  highlightColor: string
  borderColor: string
}
class Underline extends Component<UnderlineProps> {
  state = {
    lineLength: new Animated.Value(0),
    wrapperWidth: 0
  }

  expandLine() {
    Animated.timing(this.state.lineLength, {
      toValue: this.state.wrapperWidth,
      duration: this.props.duration
    }).start()
  }

  shrinkLine() {
    Animated.timing(this.state.lineLength, {
      toValue: 0,
      duration: this.props.duration
    }).start()
  }

  onLayout = (e: LayoutChangeEvent) => { this.state.wrapperWidth = e.nativeEvent.layout.width }
  render() {
    const { borderColor, highlightColor } = this.props
    return (
      <View
        onLayout={this.onLayout}
        style={[styles.underlineWrapper, {
          backgroundColor: borderColor
        }]}
      >
        <Animated.View
          style={[{
            width: this.state.lineLength,
            height: 1,
            backgroundColor: highlightColor
          }]}
        />
      </View>
    )
  }
}

export default Underline
