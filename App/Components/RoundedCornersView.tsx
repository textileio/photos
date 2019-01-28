import React, { Component } from 'react'
import { View, ViewProps, LayoutChangeEvent, ViewStyle, StyleProp } from 'react-native'

interface State {
  borderRadius: number
}

interface Props extends ViewProps {
  radiusToHeightRatio: number
}

class RoundedCornersView extends Component<Props, State> {

  static defaultProps: Props = {
    radiusToHeightRatio: 0.2
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      borderRadius: 0
    }
  }

  onLayout = (event: LayoutChangeEvent) => {
    const height = event.nativeEvent.layout.height
    this.setState({
      borderRadius: height * this.props.radiusToHeightRatio
    })
  }

  render() {
    return (
      <View {...this.props} onLayout={this.onLayout} style={[this.props.style, { borderRadius: this.state.borderRadius }]}>
        {this.props.children}
      </View>
    )
  }
}

export default RoundedCornersView
