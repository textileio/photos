import React from 'react'
import { Animated } from 'react-native'
import TextileNode from '../../TextileNodeNativeModule'

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
    TextileNode.getFileData(this.props.hash, this.props.path)
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
    console.log('------------------------------------')
    console.log(source)
    console.log('------------------------------------')
    return (
      <Animated.Image
        source={{uri: 'https://instagram.fsnc1-1.fna.fbcdn.net/vp/a51bcbe6139d45f418eb5bf2ab8da0e4/5BAAADE8/t51.2885-19/s150x150/12145595_1707571399478809_7449120_a.jpg'}}
        resizeMode={this.props.resizeMode || 'cover'}
        style={[{opacity: this.state.opacity}, this.props.style]}
        capInsets={this.props.capInsets}
      />
    )
  }

  renderImage () {
    console.log('------------------------------------???????????')
    console.log(this.state.source)
    console.log('------------------------------------???????????')
    return (
      <Animated.Image
        source={{uri: 'data:image/jpeg;base64,' + this.state.source}}
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
