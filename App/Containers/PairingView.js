// @flow
import React from 'react'
import { View, Text, Button } from 'react-native'
import { connect } from 'react-redux'
import Actions from '../Redux/TextileRedux'

// Styles
import style from './Styles/PairingViewStyle'
import photosStyle from './Styles/TextilePhotosStyle'
import { Colors } from '../Themes'

class PairingView extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      paired: false
    }
  }

  confirmPairing = () => {
    let params = this.getParams(this.props.navigation.state.params.data)
    // TODO: we should actually wait for pairing success here
    this.props.pairNewDevice(params['key'])
    this.setState(() => ({paired: true}))
  }

  cancelPairing = () => {
    this.props.navigation.navigate('OnboardingCheck')
  }

  continue = () => {
    this.props.navigation.navigate('OnboardingCheck')
  }

  getParams (url) {
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

  renderPairing (code) {
    return (
      <View style={[photosStyle.container, style.container]}>
        <View>
          <Text style={style.title}>{code}</Text>
          <Text style={style.message}>
            A new device is requesting to pair with your Textile Wallet. The Textile app running on the new device will have access to your private encryption keys and all privately stored data. Be sure that this is your device and that you see the above code displayed on the new device.
          </Text>
          <Button
            style={style.button}
            title='Pair Device'
            accessibilityLabel='pair device'
            onPress={this.confirmPairing.bind(this)}
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

  renderSuccess () {
    return (
      <View style={[photosStyle.container, style.container]}>
        <View>
          <Text style={style.title}>SUCCESS!</Text>
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
    let params = this.getParams(this.props.navigation.state.params.data)
    if (!params.key || !params.code) {
      return this.renderError()
    } else if (this.state.paired) {
      return this.renderSuccess()
    }
    return this.renderPairing(params.code)
  }
}

const mapStateToProps = state => {
  return {
    devices: state.textile && state.textile.devices ? state.textile.devices : []
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    pairNewDevice: (pubKey) => { dispatch(Actions.pairNewDevice(pubKey)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PairingView)
