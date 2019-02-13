import React, { Component } from 'react'
import { View, TextInput, ViewStyle, TextStyle, TouchableOpacity } from 'react-native'
import Icon from '@textile/react-native-icon'

import Button from './SmallButton'
import * as s from '../Themes/Constants'

const CONTAINER: ViewStyle = {
  justifyContent: 'space-between',
  borderStyle: 'solid',
  borderTopWidth: 1,
  borderColor: '#EDEDEE',
  padding: s.MARGIN_EXTRA_SMALL
}

const INPUT: TextStyle = {
  paddingTop: 0,
  paddingBottom: s.MARGIN_EXTRA_SMALL,
  fontFamily: s.FONT_FAMILY_REGULAR
}

const ITEM: ViewStyle = {
  marginLeft: s.MARGIN_SMALL
}

interface Props {
  containerStyle?: ViewStyle
  value?: string
  onUpdate?: (text: string) => void
  onSubmit?: (text: string) => void
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
          <TouchableOpacity style={ITEM}>
            <Icon name='image' color={s.COLOR_GREY_MEDIUM} size={24} />
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
    if (this.props.onUpdate) {
      this.props.onUpdate(text)
    }
  }

  submit = () => {
    if (this.props.onSubmit) {
      this.props.onSubmit(this.state.textValue!)
    }
    this.setState({
      textValue: undefined,
      disabled: true
    })
  }
}

export default AuthoringInput
