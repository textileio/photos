import React from 'react'
import { View, Text, Button, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'
import DevicesActions from '../Redux/DevicesRedux'
import DeepLink from '../Services/DeepLink'

// Styles
import style from './Styles/PairingViewStyle'
import photosStyle from './Styles/TextilePhotosStyle'
import { Colors } from '../Themes'

class PairingView extends React.PureComponent {
  constructor (props) {
    super(props)
    const params = DeepLink.paramsFromURL(this.props.navigation.state.params.data)
    this.state = {
      key: params.key,
      status: 'init'
    }
  }

  componentDidUpdate () {
    // once the view is rendered and the node is online, submit the request
    // mirror the device state changes => status
    const deviceKey = this.state.key
    const device = this.props.devices.find((d) => {
      return deviceKey && d.deviceItem.id === deviceKey
    })
    if (device) {
      console.log(device)
      this.setState(() => ({status: device.state}))
    }
  }

  confirmRequest = () => {
    this.setState(() => ({status: 'confirmed'}))
    this.props.addDeviceRequest('desktop', this.state.key)
  }

  cancel = () => {
    this.props.navigation.navigate('OnboardingCheck')
  }

  continue = () => {
    this.props.navigation.navigate('OnboardingCheck')
  }

  renderConfirm () {
    // TODO... allow user to name thread
    return (
      <View style={[photosStyle.container, style.container]}>
        <View>
          <Text style={style.key}>Address: {this.state.key}</Text>
          <Text style={style.message}>
            A new device is requesting to pair with your Textile Wallet. The Textile app running on the new device will have access to your private encryption keys and all privately stored data. Be sure that this is your device and that the address above matches the one displayed on the new device.
          </Text>
          <Button
            style={style.button}
            title={this.props.online === true ? 'Pair Device' : 'Waiting for Connection'}
            accessibilityLabel='pair device'
            onPress={this.confirmRequest.bind(this)}
            disabled={!this.props.online === true}
          />
          <View style={style.buttonMargin} />
          <Button
            style={style.button}
            title='Cancel'
            accessibilityLabel='cancel'
            onPress={this.cancel}
          />
        </View>
      </View>
    )
  }

  renderPairing (title) {
    return (
      <View style={[photosStyle.container, style.container]}>
        <View>
          <Text style={style.status}>{title}</Text>
          <ActivityIndicator size="large" color="#000000" animating={this.state.status !== 'success'} />
          <View style={style.buttonMargin} />
          <Button
            style={style.button}
            title='Continue'
            accessibilityLabel='continue'
            onPress={this.continue.bind(this)}
          />
          <Button
            style={style.button}
            title='Cancel'
            accessibilityLabel='cancel'
            onPress={this.cancel.bind(this)}
          />
        </View>
      </View>
    )
  }

  renderSuccess () {
    return (
      <View style={[photosStyle.container, style.container]}>
        <View>
          <Text style={style.status}>Success!</Text>
          <View style={style.buttonMargin} />
          <Button
            style={style.button}
            title='Continue'
            accessibilityLabel='continue'
            onPress={this.continue.bind(this)}
          />
        </View>
      </View>
    )
  }

  renderError () {
    return (
      <View style={[photosStyle.container, style.container]}>
        <View>
          <Text style={style.title}>ERROR</Text>
          <Text style={style.message}>
            There was an issue pairing with your new device. This may be caused by network connectivity or other issues. Please try again. If it continues, please report the issue with Textile.
          </Text>
          <Button
            style={style.button}
            title='Continue'
            accessibilityLabel='continue'
            onPress={this.continue.bind(this)}
          />
        </View>
      </View>
    )
  }

  render () {
    if (!this.state.key) {
      return this.renderError('ERROR')
    } else if (this.state.status === 'confirmed' && this.state.status === 'submitted') {
      // TODO: should render that we are waiting to start or connect to the network
      return this.renderPairing('CONNECTING')
    } else if (this.state.status === 'adding') {
      return this.renderPairing('PAIRING')
    } else if (this.state.status === 'added') {
      return this.renderSuccess()
    }
    return this.renderConfirm()
  }
}

const mapStateToProps = state => {
  const online = state.ipfs && state.ipfs.online && state.ipfs.online ? state.ipfs.online : false
  const nodeState = state.ipfs && state.ipfs.nodeState ? state.ipfs.nodeState.state === 'started' : false
  console.log(nodeState, online)
  return {
    devices: state.devices && state.devices.devices ? state.devices.devices : [],
    online: nodeState && online
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addDeviceRequest: (name, id) => { dispatch(DevicesActions.addDeviceRequest({name, id})) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PairingView)
