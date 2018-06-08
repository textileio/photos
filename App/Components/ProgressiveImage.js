import React from 'react'
import { View, Image } from 'react-native'
import TextileImage from '../../TextileImage'

// IPFS Image is aware of how to load higher resolution images progressively
export default class ProgressiveImage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loaded: false,
      preview: false
    }
  }

  _onPreview () {
    // just drop the thumb/default from the stack
    this.setState(() => ({preview: true}))
  }

  _onLoaded () {
    // just drop the thumb/default from the stack
    this.setState(() => ({loaded: true}))
  }

  get renderPreview () {
    return (<TextileImage
      source={this.props.previewSource}
      style={[{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}, this.props.style]}
      resizeMode={this.props.resizeMode}
      capInsets={this.props.capInsets}
      onLoad={this._onPreview.bind(this)}
    />)
  }

  renderPhoto () {
    return (<TextileImage
      source={this.props.source}
      style={[{backgroundColor: 'transparent', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}, this.props.style]}
      resizeMode={this.props.resizeMode}
      capInsets={this.props.capInsets}
      opacity={this.state.loaded ? 1 : 0}
      onLoad={this._onLoaded.bind(this)}
    />)
  }

  render () {
    if (this.state.loaded) {
      // if full res is available, don't bother showing thumb in stack
      return (
        <View style={this.props.style}>
          {this.renderPhoto()}
        </View>
      )
    } else if (this.state.preview) {
      // if thumb is available, start loading the full res
      return (
        <View style={this.props.style}>
          {this.renderPreview}
          {this.renderPhoto()}
        </View>
      )
    } else {
      // default, begin loading the thumb
      return (
        <View style={this.props.style}>
          {this.renderPreview}
        </View>
      )
    }
  }
}
