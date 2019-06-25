import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  Dimensions
} from 'react-native'

import Checkbox from './Checkbox'

import { color, fontFamily, spacing } from '../styles'

const ContainerStyle: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  marginVertical: spacing._024,
  paddingHorizontal: spacing._024,
  width: Dimensions.get('window').width
}

const InfoStyle: ViewStyle = {
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  marginLeft: spacing._008,
  flex: 1
}

const NameStyle: TextStyle = {
  fontFamily: fontFamily.bold
}

const PeerIdStyle: TextStyle = {
  fontFamily: fontFamily.regular
}

const Recommended: TextStyle = {
  fontFamily: fontFamily.regular,
  fontStyle: 'italic'
}

interface OwnProps {
  name: string
  peerId: string
  url: string
  token: string
  selected: boolean
  recommended: boolean
  disabled?: boolean
  onPressItem: (peerId: string, token: string) => void
}

type Props = OwnProps

export default class CafeItem extends Component<Props> {
  _onPress = () => {
    this.props.onPressItem(this.props.url, this.props.token)
  }

  render() {
    return (
      <TouchableOpacity
        onPress={this._onPress}
        disabled={
          this.props.disabled !== undefined ? this.props.disabled : false
        }
      >
        <View style={ContainerStyle}>
          <Checkbox
            checked={this.props.selected}
            checkedColor={color.grey_3}
            uncheckedColor={color.grey_3}
          />
          <View style={InfoStyle}>
            <Text style={NameStyle}>{this.props.name}</Text>
            <Text style={PeerIdStyle}>{this.props.peerId}</Text>
            {this.props.recommended && (
              <Text style={Recommended}>Recommended</Text>
            )}
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}
