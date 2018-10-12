import React from 'react'
import { Image, View, Text, Button, ActivityIndicator, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import ImageSc from 'react-native-scalable-image'
import DevicesActions from '../../../Redux/DevicesRedux'

import Toolbar from '../../components/Toolbar'

import styles from './statics/styles'

class DevicePairing extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      key: this.props.navigation.state.params.request.key,
      status: 'init'
    }
  }

  componentDidUpdate (prevProps, prevState, snapShot) {
    // once the view is rendered and the node is online, submit the request
    // mirror the device state changes => status
    const deviceKey = this.state.key
    const device = this.props.devices.find((d) => {
      return deviceKey && d.deviceItem.id === deviceKey
    })
    if (device) {
      this.setState(() => ({ status: device.state }))
    }
  }

  confirmRequest = () => {
    this.setState(() => ({ status: 'confirmed' }))
    this.props.addDeviceRequest('desktop', this.state.key)
  }

  cancel = () => {
    this.props.removeDeviceRequest(this.state.key)
    this.props.navigation.navigate('OnboardingCheck')
  }

  continue = () => {
    this.props.navigation.navigate('OnboardingCheck')
  }

  renderConfirm () {
    return (
      <View style={styles.contentContainer}>
        <ImageSc style={styles.mainImage} width={125} source={require('./statics/image.png')} />
        <Text style={styles.deviceId}>Be sure it matches: {this.state.key}</Text>
        <View style={styles.imageList}>
          <Button
            style={styles.button}
            title='Cancel'
            accessibilityLabel='cancel'
            onPress={this.cancel}
          />
          <Button
            style={styles.button}
            title={this.props.online === true ? 'Confirm' : 'Waiting for Connection'}
            accessibilityLabel='confirm'
            onPress={this.confirmRequest.bind(this)}
            disabled={!this.props.online === true}
          />
        </View>
      </View>
    )
  }

  renderError () {
    return (
      <View style={styles.contentContainer}>
        <ImageSc style={styles.mainImage} width={125} source={require('./statics/image.png')} />
        <Text style={styles.deviceId}>
          {
            'There was an issue pairing with your new device. '
            + 'This may be caused by network connectivity or other issues. '
            + 'Please try again. If it continues, please report the issue with Textile.'
          }
        </Text>
        <Button
          style={styles.button}
          title='Exit'
          accessibilityLabel='exit'
          onPress={this.cancel}
        />
      </View>
    )
  }

  renderStatus (message, cont) {
    return (
      <View style={styles.contentContainer}>
        <ImageSc style={styles.mainImage} width={125} source={require('./statics/image.png')} />
        <Text style={styles.deviceId}>{message}</Text>
        {!cont &&
        <ActivityIndicator size='large' color='#000000' animating={this.state.status !== 'success'} />}
        <Button
          style={styles.button}
          title={cont ? 'Continue' : 'Wait'}
          accessibilityLabel='Continue'
          onPress={this.cancel}
          disabled={!cont}
        />
      </View>
    )
  }

  renderBody () {
    if (!this.state.key) {
      return this.renderError()
    } else if (this.state.status === 'confirmed' && this.state.status === 'submitted') {
      return this.renderStatus('Connecting...', false)
    } else if (this.state.status === 'adding') {
      return this.renderStatus('Pairing...', false)
    } else if (this.state.status === 'added') {
      return this.renderStatus('Success!', true)
    }
    return this.renderConfirm()
  }

  render () {
    return (
      <View style={styles.container}>
        <Toolbar
          style={styles.toolbar}
          left={<TouchableOpacity onPress={() => { this.cancel() }}>
            <Image
              style={styles.toolbarLeft}
              source={require('./statics/icon-arrow-left.png')}
            />
          </TouchableOpacity>}>
          <Text style={styles.toolbarTitle}>Add New Device</Text>
          {this.renderBody()}
        </Toolbar>
      </View>
    )
  }
}

const mapStateToProps = state => {
  const online = state.textileNode && state.textileNode.online && state.textileNode.online ? state.textileNode.online : false
  const nodeState = state.textileNode && state.textileNode.nodeState ? state.textileNode.nodeState.state === 'started' : false
  return {
    devices: state.devices && state.devices.devices ? state.devices.devices : [],
    online: nodeState && online
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addDeviceRequest: (name, id) => { dispatch(DevicesActions.addDeviceRequest(name, id)) },
    removeDeviceRequest: (id) => { dispatch(DevicesActions.removeDeviceRequest(id)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DevicePairing)
