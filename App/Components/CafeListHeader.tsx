import React, { Component } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  Dimensions
} from 'react-native'

import Icon from '@textile/react-native-icon'
import Separator from './Separator'

import { color, fontFamily, spacing, size } from '../styles'

const Wrapper: ViewStyle = {
  width: Dimensions.get('window').width,
  flexDirection: 'column'
}

const Container: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  marginVertical: spacing._024,
  paddingHorizontal: spacing._024,
  width: Dimensions.get('window').width
}

const IconContainer: ViewStyle = {
  marginRight: spacing._012,
  alignItems: 'center',
  justifyContent: 'center'
}

const InfoStyle: ViewStyle = {
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
  marginLeft: spacing._008,
  flex: 1
}

const LabelStyle: TextStyle = {
  fontFamily: fontFamily.bold
}

interface OwnProps {
  onPress: () => void
}

type Props = OwnProps

export default class CafeListHeader extends Component<Props> {
  render() {
    return (
      <View style={Wrapper}>
        <TouchableOpacity onPress={this.props.onPress}>
          <View style={Container}>
            <View style={IconContainer}>
              <Icon name="search" size={size._032} color={color.grey_3} />
            </View>
            <View style={InfoStyle}>
              <Text style={LabelStyle}>Search for a Cafe by Peer ID</Text>
            </View>
          </View>
        </TouchableOpacity>
        <Separator />
      </View>
    )
  }
}
