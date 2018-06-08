import React from 'react'
import { View, Image } from 'react-native'
import TextileImage from '../../TextileImage'

// IPFS Image is aware of how to load higher resolution images progressively
export default class ProgressiveImage extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      loaded: false
    }
  }

  _onLoaded () {
    // just drop the thumb/default from the stack
    this.setState(() => ({loaded: true}))
  }

  renderPreview () {
    return (<TextileImage
      source={this.props.previewSource}
      style={[{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}, this.props.style]}
      resizeMode={this.props.resizeMode}
      capInsets={this.props.capInsets}
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
    return (
      <View style={this.props.style}>
        {this.renderPreview()}
        {this.renderPhoto()}
      </View>
    )
  }
}
