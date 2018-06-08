import React from 'react'
import { View } from 'react-native'
import TextileImage from '../../TextileImage'

// IPFS Image is aware of how to load higher resolution images progressively
export default class ProgressiveImage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loaded: false
    }
  }

  get renderDefault () {
    return (<TextileImage
      source={this.props.defaultSource}
      style={[{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}, this.props.style]}
      resizeMode={this.props.resizeMode}
      capInsets={this.props.capInsets}
      onLoad={this._onDefault.bind(this)}
    />)
  }

  get renderPhoto () {
    return (<TextileImage
      source={this.props.source}
      style={[{backgroundColor: 'transparent', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}, this.props.style]}
      resizeMode={this.props.resizeMode}
      capInsets={this.props.capInsets}
    />)
  }

  _onDefault () {
    // just drop the thumb/default from the stack
    this.setState(() => ({loaded: true}))
  }

  render () {
    if (this.state.loaded) {
      return (
        <View style={this.props.style}>
          {this.renderDefault}
          {this.renderPhoto}
        </View>
      )
    } else {
      return (
        <View style={this.props.style}>
          {this.renderDefault}
        </View>
      )
    }
  }
}
