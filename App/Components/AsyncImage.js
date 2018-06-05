import React from 'react'
import { View, Image, StyleSheet, Animated } from 'react-native'
import IPFS from '../../TextileIPFSNativeModule'

export default class AsyncImage extends React.Component {
  constructor (props) {
    super(props)
    this.hasCanceled_ = false
    this.state = {
      path: '/thumb', // initial path to load
      requested: false, // state of request
      loaded: false, // state of image loading
      thumb: {}, // thumb image src
      full: {}, // full res image src
      opacity: new Animated.Value(0.0), // full res image opacity
      retry: 2, // allowed thumb retries before a success/error
      error: false // has the image errored
    }
  }

  componentWillMount () {
    // If node is already started, we should just get things going
    if (this.props.displayImages === true) {
      this._createRequest(this.props.hash, this.state.path)
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    // if node just transitions to started, we should make our request
    if (nextProps.displayImages !== this.props.displayImages && nextProps.displayImages === true && !this.state.requested) {
      this._createRequest(this.props.hash, this.state.path)
      return false
    }
    return this.state.error !== nextState.error ||
      this.state.loaded !== nextState.loaded ||
      this.state.requested !== nextState.requested ||
      this.state.thumb.uri !== nextState.thumb.uri ||
      this.state.full.uri !== nextState.full.uri ||
      this.state.opacity !== nextState.opacity
  }

  componentWillUnmount () {
    // stop trying to update any UI associated with this asyncimage
    this.hasCanceled_ = true
  }

  _createRequest (hash, path) {
    this.setState(() => ({requested: true}))
    IPFS.getHashRequest(hash, path)
      .then(this._setSource)
      .catch(this._retry) // todo: handle failed hash requests vs. unmount
  }

  _retry () {
    // perform a limited number of retries and only retry thumb
    // thumb will display if full res fails just once
    if (!this.hasCanceled_ && this.state.retry > 0 && this.state.path === '/thumb') {
      this.setState(() => ({retry: this.state.retry - 1}))
      this._createRequest(this.props.hash, this.state.path)
    } else {
      this._error()
    }
  }

  _error () {
    // Calls if the image or hash fails to load
    // but allow thumb to remain visible if error only on full res
    if (this.state.path === '/thumb') {
      this.setState(() => ({error: true, loaded: false}))
    } else {
      this.setState(() => ({full: {}}))
    }
  }

  _success () {
    // Calls after image succesfully loads. Resets available retries for later loads
    this.setState(() => ({retry: 2}))
  }

  _onLoadPhoto () {
    Animated.timing(this.state.opacity, {
      toValue: 1,
      duration: 100
    }).start()
  }

  _setSource = (source) => {
    // After async token is received, it readys the image source
    if (!this.hasCanceled_) {
      if (this.state.path === '/thumb') {
        if (this.props.progressiveLoad) {
          // begin request for high-res image
          this._createRequest(this.props.hash, '/photo')
        }
        this.setState(() => ({loaded: true, thumb: source, retry: 2, path: '/photo'}))
      } else {
        this.setState(() => ({full: source}))
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

  renderThumb () {
    return (
      this.state.thumb.uri && <Image
        source={this.state.thumb}
        resizeMode={this.props.resizeMode || 'cover'}
        style={[{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}, this.props.style]}
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

  renderPhoto () {
    return (
      this.state.full.uri && <Animated.Image
        source={this.state.full}
        resizeMode={this.props.resizeMode || 'cover'}
        style={[{opacity: this.state.opacity, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}, this.props.style]}
        capInsets={this.props.capInsets}
        onLoad={(event) => this._onLoadPhoto(event)}
        onError={() => this._error}
      />
    )
  }

  render () {
    if (this.state.loaded) {
      // load the best available option
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
    } else {
      return this.placeholder()
    }
  }
}
