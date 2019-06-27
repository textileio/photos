import React, { PureComponent } from 'react'
import {
  View,
  Text,
  ViewStyle,
  TextStyle,
  Dimensions,
  TouchableOpacity
} from 'react-native'

import Icon from '@textile/react-native-icon'

import { color, spacing, fontFamily, size } from '../styles'

// Must set width manually for proper rendering with flexbox in a flatlist
const Container: ViewStyle = {
  width: Dimensions.get('window').width,
  flexDirection: 'row',
  alignItems: 'center',
  paddingVertical: spacing._024,
  paddingHorizontal: spacing._016
}

const PeerId: TextStyle = {
  flex: 1,
  fontFamily: fontFamily.regular,
  marginRight: spacing._016
}

interface OwnProps {
  peerId: string
  onPress: () => void
}

type Props = OwnProps

export default class Cafe extends PureComponent<Props> {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={Container}>
          <Text style={PeerId}>{this.props.peerId}</Text>
          <Icon name="chevron-right" size={size._024} color={color.grey_4} />
        </View>
      </TouchableOpacity>
    )
  }
}
