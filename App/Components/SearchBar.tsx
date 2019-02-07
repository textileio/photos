import React, { Component } from 'react'
import { View, TextInput, ViewStyle, TextStyle, TouchableOpacity, TextInputProps } from 'react-native'
import Icon from '@textile/react-native-icon'

import RoundedCornersView from './RoundedCornersView'

interface Props {
  containerStyle: ViewStyle
  inputStyle: TextStyle
  additionalInputProps: TextInputProps
  placeholder: string
  iconColor: string
  onTextChanged?: (text?: string) => void
}

interface State {
  value?: string
  showClear: boolean
}

class SearchBar extends Component<Props, State> {

  static defaultProps: Props = {
    containerStyle: {
      paddingTop: 8,
      paddingBottom: 8,
      paddingLeft: 12,
      paddingRight: 12,
      backgroundColor: 'lightgrey'
    },
    inputStyle: {
      flex: 1,
      fontSize: 16,
      backgroundColor: 'white',
      padding: 0,
      marginTop: 6,
      marginBottom: 6
    },
    additionalInputProps: {},
    placeholder: 'Search...',
    iconColor: 'black'
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      showClear: false
    }
  }

  textChanged = (text?: string) => {
    this.setState({
      value: text,
      showClear: text !== undefined && text.length > 0
    })
    if (this.props.onTextChanged) {
      this.props.onTextChanged(text)
    }
  }

  clear = () => {
    this.textChanged(undefined)
  }

  render() {
    // const borderRadius = (this.props.inputStyle.fontSize || SearchBar.defaultProps.inputStyle.fontSize!) / 3
    const inputColor = this.props.inputStyle.backgroundColor || SearchBar.defaultProps.inputStyle.backgroundColor!
    return (
      <View style={[SearchBar.defaultProps.containerStyle, this.props.containerStyle]}>
        <RoundedCornersView style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: inputColor }}>
          <Icon
            name={'search_16'}
            size={16}
            color={this.props.iconColor}
            style={{ margin: 6 }}
          />
          <TextInput
            {...this.props.additionalInputProps}
            style={[SearchBar.defaultProps.inputStyle, this.props.inputStyle]}
            placeholder={this.props.placeholder}
            underlineColorAndroid='transparent'
            onChangeText={this.textChanged}
            value={this.state.value}
          />
          {this.state.showClear &&
            <TouchableOpacity onPress={this.clear}>
              <Icon
                name={'x_16'}
                size={16}
                color={this.props.iconColor}
                style={{ margin: 6 }}
              />
            </TouchableOpacity>
          }
        </RoundedCornersView>
      </View>
    )
  }
}

export default SearchBar
