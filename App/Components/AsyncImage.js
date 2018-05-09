import React, { Component } from 'react'
import { View, Image } from 'react-native'
import IPFS from '../../TextileIPFSNativeModule'

export default class AsyncImage extends React.PureComponent {

  constructor(props) {
    super(props)
    this.state = { loaded: false, source: {} }
  }

  componentWillMount () {
    const {
      hash,
      path
    } = this.props
    IPFS.getHashRequest(hash, path).then(this._setSource)
  }
  _setSource = (source) => {
    this.setState(() => ({ loaded: true, source }))
  }
  render () {
    const {
      style,
      resizeMode,
      containerStyle
    } = this.props

    return (
      <View
        style={containerStyle || style}>
        {this.state.loaded &&
          < Image
            source={this.state.source}
            resizeMode={resizeMode}
            style={style}
          />
        }

        {!this.state.loaded &&
        <View
          style={[
            style,
            {
              backgroundColor: 'transparent',
              position: 'absolute'
            }
          ]} />
        }

      </View>
    )
  }
}
