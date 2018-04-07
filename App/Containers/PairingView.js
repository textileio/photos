// @flow
import React from 'react'
import {View, Text, ImageBackground, Dimensions} from 'react-native'
import { Overlay, Button } from 'react-native-elements'

// More info here: https://facebook.github.io/react-native/docs/flatlist.html

// Styles
import styles from './Styles/LogViewStyle'

class PairingView extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      data: [],
      limit: 10
    }
  }

  getParams(url) {
    var regex = /[?&]([^=#]+)=([^&#]*)/g,
      params = {},
      match;
    while (match = regex.exec(url)) {
      params[match[1]] = match[2];
    }
    return params
  }
  render () {
    let code = 'WARN'
    if (this.props.navigation.state.params.data) {
      let params = this.getParams(this.props.navigation.state.params.data)
      if ('code' in params) {
        code = params['code']
      }
    }
    //{}
    return (
      <ImageBackground
        source={require('../Images/backgrounds/log-background.png')}
        style={styles.backgroundImage}>
        <Overlay
          isVisible="true"
          windowBackgroundColor="rgba(0, 0, 0, .2)"
          width={ Dimensions.get('window').width * 0.8 }
          height="auto"
        >
          <View style={{alignSelf: 'center'}}>
            <Text style={{alignSelf: 'center'}}>New Device Request</Text>
            <Text style={{fontWeight: 'bold', fontSize: 50, margin: 40,}}>{code}</Text>
            <Button buttonStyle={{
              height: 45,
              borderColor: "transparent",
              borderWidth: 0,
              borderRadius: 5,
            }} title="Pair Device"/>
            <Button buttonStyle={{
              backgroundColor: "rgba(66, 22, 77, 1)",
              height: 45,
              borderColor: "transparent",
              borderWidth: 0,
              borderRadius: 5,
              marginVertical: 20
            }} title="Not Now"/>
          </View>
        </Overlay>
      </ImageBackground>
    )
  }
}

export default PairingView
