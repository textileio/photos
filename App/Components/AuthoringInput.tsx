import React, { Component } from 'react'
import { View, TextInput, ViewStyle, TextStyle, TouchableOpacity, Dimensions } from 'react-native'
import Icon from '@textile/react-native-icon'

import Button from './SmallButton'
import { color, fontFamily, spacing } from '../styles'

const CONTAINER: ViewStyle = {
  justifyContent: 'space-between',
  borderStyle: 'solid',
  borderTopWidth: Dimensions.get('screen').scale > 1 ? 0.5 : 1,
  borderColor: color.grey_5,
  padding: spacing.screenEdge
}

const INPUT: TextStyle = {
  paddingTop: 0,
  paddingBottom: spacing._8,
  fontFamily: fontFamily.regular
}

const ITEM: ViewStyle = {
  marginLeft: spacing._16
}

interface Props {
  containerStyle?: ViewStyle
  value?: string
  onMessageUpdate?: (text: string) => void
  onSendMessage?: (text: string) => void
  onSharePhoto?: () => void
}

interface State {
  textValue?: string,
  disabled: boolean
}

class AuthoringInput extends Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      textValue: props.value,
      disabled: (props.value || '').length < 1
    }
  }

  render() {
    return (
      <View style={[this.props.containerStyle, CONTAINER]}>
        <TextInput
          style={INPUT}
          multiline={true}
          placeholder='Write a message...'
          placeholderTextColor='#4a4a4a'
          onChangeText={this.updateText}
          value={this.state.textValue}
        />
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
          <TouchableOpacity style={ITEM} onPress={this.props.onSharePhoto}>
            <Icon name='image' color={color.grey_4} size={24} />
          </TouchableOpacity>
          <Button style={ITEM} disabled={this.state.disabled} text={'send'} onPress={this.submit} />
        </View>
      </View>
    )
  }

  updateText = (text: string) => {
    this.setState({
      textValue: text,
      disabled: text.length < 1
    })
    if (this.props.onMessageUpdate) {
      this.props.onMessageUpdate(text)
    }
  }

  submit = () => {
    if (this.props.onSendMessage) {
      this.props.onSendMessage(this.state.textValue!)
    }
    this.setState({
      textValue: undefined,
      disabled: true
    })
  }
}

export default AuthoringInput
