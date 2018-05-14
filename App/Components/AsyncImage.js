import React from 'react'
import { View, Image } from 'react-native'
import IPFS from '../../TextileIPFSNativeModule'
import { connect } from 'react-redux'

class AsyncImage extends React.Component {
  constructor (props) {
    super(props)
    this.hasCanceled_ = false
    this.state = { requested: false, loaded: false, source: {} }
  }

  componentWillMount () {
    // If node is already started, we should just get things going
    if (this.props.nodeState === 'started') {
      this._createRequest()
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    // if node just transitions to started, we should make our request
    if (nextProps.nodeState !== this.props.nodeState && nextProps.nodeState === 'started') {
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
    IPFS.getHashRequest(this.props.hash, this.props.path)
      .then(this._setSource)
      .catch(() => { }) // todo: handle failed image requests vs. unmount
    this.setState(() => ({requested: true}))
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

const mapStateToProps = (state, ownProps) => {
  return {
    nodeState: state.ipfs.nodeState.state
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AsyncImage)
