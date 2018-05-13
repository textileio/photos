import React from 'react'
import { View, Image } from 'react-native'
import IPFS from '../../TextileIPFSNativeModule'

export default class AsyncImage extends React.Component {

  constructor(props) {
    super(props)
    this.state = { loaded: false, source: {} }
  }

  asyncRequest (promise) {
    let hasCanceled_ = false
    return {
      promise: new Promise(
        (resolve, reject) => promise
          .then(r => hasCanceled_
            ? reject({isCanceled: true})
            : resolve(r)
          )
      ),
      cancel () {
        hasCanceled_ = true
      }
    }
  }

  componentWillMount () {
    const {
      hash,
      path
    } = this.props
    this.request = this.asyncRequest(IPFS.getHashRequest(hash, path)
      .then(this._setSource)
      .catch(() => { })) // todo: handle failed image requests vs. unmount
  }

  componentWillUnmount () {
    // Reduces state update attempts of unmounted thumbs
    this.request.cancel()
  }

  _setSource = (source) => {
    this.setState(() => ({loaded: true, source}))
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
