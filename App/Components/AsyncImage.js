import React from 'react'
import { Animated } from 'react-native'
import IPFS from '../../TextileIPFSNativeModule'

export default class AsyncImage extends React.Component {
  constructor (props) {
    super(props)
    let initialOpacity = this.props.fadeIn ? 0.0 : 1.0
    this.hasCanceled_ = false
    this.state = {
      requested: false, // state of request
      loaded: false, // state of image loading
      source: {}, // image src
      opacity: new Animated.Value(initialOpacity), // full res image opacity
      retry: 2, // allowed retries before a success/error
      error: false // has the image errored
    }
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
    return this.state.error !== nextState.error ||
      this.state.loaded !== nextState.loaded ||
      this.state.requested !== nextState.requested ||
      this.state.source.uri !== nextState.source.uri ||
      this.state.opacity !== nextState.opacity
  }

  componentWillUnmount () {
    // stop trying to update any UI associated with this asyncimage
    this.hasCanceled_ = true
  }

  _createRequest () {
    this.setState(() => ({requested: true}))
    IPFS.getHashRequest(this.props.hash, this.props.path)
      .then(this._setSource)
      .catch(this._retry) // todo: handle failed hash requests vs. unmount
  }

  _retry () {
    // perform a limited number of retries
    if (!this.hasCanceled_ && this.state.retry > 0) {
      this.setState(() => ({retry: this.state.retry - 1}))
      this._createRequest()
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
    if (this.props.fadeIn) {
      Animated.timing(this.state.opacity, {
        toValue: 1,
        duration: 100
      }).start()
    }
  }

  _setSource = (source) => {
    // After async token is received, it readys the image source
    if (!this.hasCanceled_) {
      this.setState(() => ({loaded: true, source, retry: 2}))
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
      <Animated.Image
        source={source}
        resizeMode={this.props.resizeMode || 'cover'}
        style={[{opacity: this.state.opacity}, this.props.style]}
        capInsets={this.props.capInsets}
      />
    )
  }

  renderImage () {
    return (
      <Animated.Image
        source={this.state.source}
        resizeMode={this.props.resizeMode || 'cover'}
        style={[{opacity: this.state.opacity}, this.props.style]}
        capInsets={this.props.capInsets}
        onLoad={() => {
          this._success()
        }}
        onError={() => {
          this._retry()
        }}
      />
    )
  }

  render () {
    if (this.state.loaded) {
      return this.renderImage()
    } else {
      return this.placeholder()
    }
  }
}
