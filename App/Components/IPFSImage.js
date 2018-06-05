import React from 'react'
import { View} from 'react-native'
import AsyncImage from './AsyncImage'

// IPFS Image is aware of how to load higher resolution images progressively
export default class IPFSImage extends React.Component {
  renderThumb () {
    return (<AsyncImage
      hash={this.props.hash}
      path={'/thumb'}
      style={[{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}, this.props.style]}
      resizeMode={this.props.resizeMode}
      capInsets={this.props.capInsets}
      displayImages={this.props.displayImages}
      showProgress
    />)
  }

  renderPhoto () {
    return (<AsyncImage
      hash={this.props.hash}
      path={'/photo'}
      style={[{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}, this.props.style]}
      resizeMode={this.props.resizeMode}
      capInsets={this.props.capInsets}
      displayImages={this.props.displayImages}
      fadeIn
    />)
  }

  render () {
    if (this.props.progressiveLoad) {
      // Stack the full over the thumb so it appears once loaded
      return (
        <View style={this.props.style || {flex: 1, height: undefined, width: undefined}}>
          { this.renderThumb() }
          { this.renderPhoto() }
        </View>
      )
    } else {
      return (
        <View style={this.props.style || {flex: 1, height: undefined, width: undefined}}>
          { this.renderThumb() }
        </View>
      )
    }
  }
}
