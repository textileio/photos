import React from 'react'
import { View, Image } from 'react-native'
import IPFS from '../../TextileIPFSNativeModule'

export default class AsyncImage extends React.Component {
  constructor (props) {
    super(props)
    this.hasCanceled_ = false
    this.state = { requested: false, loaded: false, source: {}, retry: 1 }
  }

  componentWillMount () {
    // If node is already started, we should just get things going
    if (this.props.displayImages === true) {
      this._createRequest()
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    // if node just transitions to started, we should make our request
    if (nextProps.displayImages !== this.props.displayImages && nextProps.displayImages === true && !this.state.requested) {
      this._createRequest()
      return false
    }
    // request has been sent, loaded has become true
    return this.state.requested && this.state.loaded !== nextState.loaded && nextState.loaded === true
  }

  componentWillUnmount () {
    this.hasCanceled_ = true
  }

  _createRequest () {
    this.setState(() => ({requested: true}))
    IPFS.getHashRequest(this.props.hash, this.props.path)
      .then(this._setSource)
      .catch(() => { }) // todo: handle failed image requests vs. unmount
  }

  _retry () {
    this.setState(() => ({retry: 0, loaded: false}))
    IPFS.getHashRequest(this.props.hash, this.props.path)
      .then(this._setSource)
      .catch(() => { }) // todo: handle failed image requests vs. unmount
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
          onError={() => {
            if (this.state.retry > 0) {
              this._retry()
            }
          }}
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
