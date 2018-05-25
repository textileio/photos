import React from 'react'
import { Image } from 'react-native'
import IPFS from '../../TextileIPFSNativeModule'

export default class AsyncImage extends React.Component {
  constructor (props) {
    super(props)
    this.hasCanceled_ = false
    this.state = { requested: false, loaded: false, source: {}, retry: 2, error: false }
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
    if (this.state.error !== nextState.error) {
      return true
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
      .catch(this._retry) // todo: handle failed hash requests vs. unmount
  }

  _retry () {
    if (this.state.retry > 0) {
      this.setState(() => ({retry: 0, loaded: false}))
      IPFS.getHashRequest(this.props.hash, this.props.path)
        .then(this._setSource)
        .catch(this._retry) // todo: handle failed hash requests vs. unmount
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
      this.setState(() => ({loaded: true, source}))
    }
  }

  placeholder () {
    if (this.state.error) {
      return (
        <Image
          source={require('../Images/error.png')}
          resizeMode={this.props.resizeMode || 'cover'}
          style={this.props.style || {flex: 1, height: undefined, width: undefined}}
          capInsets={this.props.capInsets}
        />
      )
    } else if (!this.state.loaded) {
      return (
        <Image
          source={require('../Images/connecting.png')}
          resizeMode={this.props.resizeMode || 'cover'}
          style={this.props.style || {flex: 1, height: undefined, width: undefined}}
          capInsets={this.props.capInsets}
        />
      )
    } else {
      return (
        <Image
          source={require('../Images/loading.png')}
          resizeMode={this.props.resizeMode || 'cover'}
          style={this.props.style || {flex: 1, height: undefined, width: undefined}}
          capInsets={this.props.capInsets}
        />
      )
    }
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
