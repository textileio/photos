import React from 'react'
import { Image } from 'react-native'
import IPFS from '../../TextileIPFSNativeModule'

export default class AsyncImage extends React.Component {
  constructor (props) {
    super(props)
    this.hasCanceled_ = false
    this.state = { path: '/thumb', requested: false, loaded: false, source: {}, retry: 2, error: false }
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
    return this.state.path !== nextState.path ||
      this.state.error !== nextState.error ||
      this.state.loaded !== nextState.loaded ||
      this.state.requested !== nextState.requested ||
      this.state.source.uri !== nextState.source.uri
  }

  componentWillUnmount () {
    this.hasCanceled_ = true
  }


  _createRequest () {
    this.setState(() => ({requested: true}))
    IPFS.getHashRequest(this.props.hash, this.state.path)
      .then(this._setSource)
      .catch(this._retry) // todo: handle failed hash requests vs. unmount
  }

  _retry () {
    if (this.state.retry > 0 && !this.hasCanceled_) {
      this.setState(() => ({retry: this.state.retry - 1, loaded: false}))
      IPFS.getHashRequest(this.props.hash, this.state.path)
        .then(this._setSource)
        .catch(this._retry)
    } else {
      this._error()
    }
  }

  _error () {
    // Calls if the image or hash fails to load
    this.setState(() => ({error: true, loaded: false}))
  }

  _success () {
    // Calls after image succesfully loads. Resets available retries for later loads
    this.setState(() => ({retry: 2}))
  }

  _setSource = (source) => {
    // After async token is received, it readys the image source
    if (!this.hasCanceled_) {
      this.setState(() => ({loaded: true, source, retry: 2}))
      if (this.props.progressiveLoad && this.state.path === '/thumb') {
        IPFS.getHashRequest(this.props.hash, '/photo')
          .then(this._setSource)
        this.setState(() => ({path: '/photo'}))
      }
    }
  }

  placeholder () {
    let source = require('../Images/loading.png')
    if (this.state.error) {
      source = require('../Images/error.png')
    } else if (!this.state.requested) {
      source = require('../Images/connecting.png')
    }
    return (
      <Image
        source={source}
        resizeMode={this.props.resizeMode || 'cover'}
        style={this.props.style || {flex: 1, height: undefined, width: undefined}}
        capInsets={this.props.capInsets}
      />
    )
  }

  render () {
    if (this.state.loaded) {
      return (
        <Image
          source={this.state.source}
          resizeMode={this.props.resizeMode || 'cover'}
          style={this.props.style || {flex: 1, height: undefined, width: undefined}}
          capInsets={this.props.capInsets}
          onLoad={() => {
            this._success()
          }}
          onError={() => {
            this._retry()
          }}
        />)
    } else {
      return this.placeholder()
    }
  }
}
