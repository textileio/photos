import React from 'react'
import { View, Text, Button } from 'react-native'
import { connect } from 'react-redux'
import DevicesActions from '../Redux/DevicesRedux'

// Styles
import style from './Styles/PairingViewStyle'
import photosStyle from './Styles/TextilePhotosStyle'
import { Colors } from '../Themes'

class PairingView extends React.PureComponent {
  constructor (props) {
    super(props)
    const params = getParams(this.props.navigation.state.params.data)
    this.state = {
      key: params.key,
      status: 'init'
    }
  }

  componentDidUpdate () {
    // let params = getParams(this.props.navigation.state.params.data)
    // const device = props.devices.filter((d) => {
    //   return params.key && d.deviceItem.id === params.key
    // })

    console.log('update')
    console.log(this.props.devices)
    console.log(this.props.online)

    // once the view is rendered and the node is online, submit the request
    if (this.props.online === true && this.state.status === 'confirmed') {
      console.log('online')
      this.submitRequest()
    }

    console.log(this.state.key)
    const deviceKey = this.state.key
    const device = this.props.devices.find((d) => {
      return deviceKey && d.deviceItem.id === deviceKey
    })

    console.log(device)

    if (device) {
      this.setState(() => ({status: device.state}))
    }
  }

  confirmRequest = () => {
    this.setState(() => ({status: 'confirmed'}))
  }

  submitRequest = () => {
    // TODO: we should actually wait for pairing success here
    // TODO: allow user to rename device
    this.props.addDeviceRequest('desktop', this.state.key)
  }

  cancelPairing = () => {
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
            title='Pair Device'
            accessibilityLabel='pair device'
            onPress={this.confirmRequest.bind(this)}
          />
          <View style={style.buttonMargin} />
          <Button
            style={style.button}
            title='Not Now'
            accessibilityLabel='do not pair'
            onPress={this.cancelPairing}
          />
        </View>
      </View>
    )
  }
  renderPairing (title) {
    return (
      <View style={[photosStyle.container, style.container]}>
        <View>
          <Text style={style.title}>{title}</Text>
          <View style={style.buttonMargin} />
          <Button
            style={style.button}
            title='Continue'
            accessibilityLabel='continue'
            onPress={this.continue.bind(this)}
            disabled={this.state.status !== 'success'}
          />
          <Button
            style={style.button}
            title='Cancel'
            accessibilityLabel='cancel'
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
            style={{
              fontFamily: 'Biotif-Regular',
              color: Colors.charcoal,
              fontSize: 18,
              textAlign: 'justify'
            }}
            title='Continue'
            accessibilityLabel='continue'
            onPress={this.continue.bind(this)}
          />
        </View>
      </View>
    )
  }

  render () {
    console.log('RENDER', this.state.status)
    if (!this.state.key) {
      return this.renderError('ERROR')
    } else if (this.state.status === 'confirmed') {
      // TODO: should render that we are waiting to start or connect to the network
      return this.renderPairing('CONNECTING')
    } else if (this.state.status === 'adding') {
      return this.renderPairing('PAIRING')
    } else if (this.state.status === 'added') {
      return this.renderPairing('SUCCESS!')
    }
    return this.renderConfirm()
  }
}

const mapStateToProps = state => {
  return {
    devices: state.devices && state.devices.devices ? state.devices.devices : [],
    online: state.ipfs.online ? state.ipfs.online : false
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    addDeviceRequest: (name, id) => { dispatch(DevicesActions.addDeviceRequest({name, id})) }
  }
}

function getParams (url) {
  let query = url.split('?')[1]
  let vars = query.split('&')
  let queryString = {}
  for (let i = 0; i < vars.length; i++) {
    let pair = vars[i].split('=')
    // If first entry with this name
    if (typeof queryString[pair[0]] === 'undefined') {
      queryString[pair[0]] = decodeURIComponent(pair[1])
      // If second entry with this name
    } else if (typeof queryString[pair[0]] === 'string') {
      let arr = [queryString[pair[0]], decodeURIComponent(pair[1])]
      queryString[pair[0]] = arr
      // If third or later entry with this name
    } else {
      queryString[pair[0]].push(decodeURIComponent(pair[1]))
    }
  }
  return queryString
}

export default connect(mapStateToProps, mapDispatchToProps)(PairingView)
