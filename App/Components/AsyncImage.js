import React from 'react'
import { View, Image } from 'react-native'
import IPFS from '../../TextileIPFSNativeModule'

export default class AsyncImage extends React.Component {

  constructor (props) {
    super(props)
    this.state = { loaded: false, source: {} }
  }

  componentWillMount () {
    const {
      hash,
      path
    } = this.props
    this.hasCanceled_ = false
    IPFS.getHashRequest(hash, path)
      .then(this._setSource)
      .catch(() => { }) // todo: handle failed image requests vs. unmount
  }
  
  componentWillUnmount () {
    this.hasCanceled_ = true
  }

  _setSource = (source) => {
    if (!this.hasCanceled_) {
      this.setState(() => ({loaded: true, source}))
    }
  }

  render () {
    if (this.state.loaded) {
      return (
        < Image
          source={this.state.source}
          resizeMode={this.props.resizeMode || 'cover'}
          style={this.props.style || {flex: 1, height: undefined, width: undefined}}
          capInsets={this.props.capInsets}
        />)
    } else {
      return (
        <View
          style={[
            this.props.style,
            {
              backgroundColor: 'transparent',
              position: 'absolute'
            }
          ]}
        />)
    }
  }
}
