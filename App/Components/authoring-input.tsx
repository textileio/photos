import React, { Component } from 'react'
import {
  View,
  TextInput,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
  Dimensions,
  Image,
  ImageStyle,
  TouchableWithoutFeedback
} from 'react-native'
import Icon from '@textile/react-native-icon'

import Button from './SmallButton'
import { color, textStyle, spacing } from '../styles'
import { SharedImage } from '../features/group/add-photo/models'
import { IFiles } from '@textile/react-native-sdk'
import TextileImage from './TextileImage'
import colors from '../Themes/Colors'

const CONTAINER: ViewStyle = {
  borderStyle: 'solid',
  borderTopWidth: Dimensions.get('screen').scale > 1 ? 0.5 : 1,
  borderColor: color.grey_5,
  padding: spacing.screenEdge,
  backgroundColor: 'white'
}

const INPUT: TextStyle = {
  ...textStyle.body_m,
  paddingTop: 0,
  paddingBottom: spacing._008
}

const ITEM: ViewStyle = {
  marginLeft: spacing._016
}

const BUTTON: ViewStyle = {
  ...ITEM,
  backgroundColor: color.action_3
}

const BUTTON_TEXT: TextStyle = {
  color: color.grey_7
}

const IMAGE_SELECTION: ViewStyle = {
  ...ITEM,
  alignSelf: 'flex-start',
  alignContent: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40
}

const IMAGE_WRAPPER: ViewStyle = {
  width: 40,
  height: 40,
  borderRadius: 6,
  overflow: 'hidden'
}

const IMAGE: ImageStyle = {
  resizeMode: 'cover',
  width: 40,
  height: 40,
  borderRadius: 6
}

interface Props {
  activeGalleryButton?: boolean
  containerStyle?: ViewStyle
  value?: string
  sharingImage?: SharedImage
  sharingFiles?: IFiles
  onMessageUpdate?: (text: string) => void
  onSendMessage?: (text: string) => void
  onSharePhoto?: () => void
  cancelShare?: () => void
}

interface State {
  textValue?: string
  sharing: boolean
  disabled: boolean
}

class AuthoringInput extends Component<Props, State> {
  textInput?: TextInput = undefined
  constructor(props: Props) {
    super(props)
    this.state = {
      textValue: props.value,
      sharing:
        props.sharingFiles !== undefined || props.sharingImage !== undefined,
      disabled:
        props.sharingFiles === undefined &&
        props.sharingImage === undefined &&
        (props.value || '').length < 1
    }
  }

  isSubmitDisabled = (text?: string) => {
    return (
      this.props.sharingFiles === undefined &&
      this.props.sharingImage === undefined &&
      (text || '').length < 1
    )
  }

  componentDidUpdate(prevProps: Props) {
    // If an image has been selected, we want to enable the send button
    if (
      prevProps.sharingFiles !== this.props.sharingFiles ||
      prevProps.sharingImage !== this.props.sharingImage
    ) {
      this.setState({
        sharing:
          this.props.sharingFiles !== undefined ||
          this.props.sharingImage !== undefined,
        disabled: this.isSubmitDisabled(this.state.textValue)
      })
    }
  }

  cancelButton() {
    return (
      <View
        style={{
          position: 'absolute',
          right: -5,
          top: -3,
          zIndex: 10,
          alignContent: 'center',
          justifyContent: 'center',
          padding: 3,
          backgroundColor: 'black',
          width: 16,
          height: 16,
          borderRadius: 8
        }}
      >
        <Icon name="x_16" color={'white'} size={10} />
      </View>
    )
  }
  sharingThumbnail() {
    const { sharingImage, sharingFiles } = this.props
    if (sharingImage) {
      const sourceUri =
        sharingImage.origURL && sharingImage.origURL !== ''
          ? sharingImage.origURL
          : sharingImage.uri
      return (
        <TouchableWithoutFeedback
          style={IMAGE_WRAPPER}
          onPress={this.props.cancelShare}
        >
          <View style={IMAGE_SELECTION}>
            {this.cancelButton()}
            <View style={IMAGE_WRAPPER}>
              <Image
                source={{ uri: sourceUri }}
                resizeMode={'cover'}
                style={IMAGE}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      )
    } else if (sharingFiles) {
      const filesList = sharingFiles.files
      const fileIndex =
        filesList && filesList.length > 0 && filesList[0].index
          ? filesList[0].index
          : 0
      return (
        <TouchableWithoutFeedback onPress={this.props.cancelShare}>
          <View style={IMAGE_SELECTION}>
            {this.cancelButton()}
            <View style={IMAGE_WRAPPER}>
              <TextileImage
                target={sharingFiles.data}
                index={fileIndex}
                forMinWidth={70}
                resizeMode={'cover'}
                style={{
                  width: 40,
                  height: 4,
                  flex: 1,
                  flexDirection: 'column'
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      )
    }
    return <View />
  }
  imageThumbnail() {
    const c = this.props.activeGalleryButton ? color.action_4 : color.grey_5
    return <Icon name="image" color={c} size={24} />
  }
  render() {
    return (
      <View style={[this.props.containerStyle, CONTAINER]}>
        <TextInput
          ref={input => (this.textInput = input ? input : undefined)}
          style={INPUT}
          multiline={true}
          placeholder={
            this.state.sharing ? 'Add a message...' : 'Write a message...'
          }
          placeholderTextColor={color.grey_3}
          onChangeText={this.updateText}
          value={this.state.textValue}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            minHeight: 40
          }}
        >
          {this.sharingThumbnail()}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'flex-end'
            }}
          >
            <TouchableOpacity style={ITEM} onPress={this.props.onSharePhoto}>
              {this.imageThumbnail()}
            </TouchableOpacity>
            <Button
              style={BUTTON}
              textStyle={BUTTON_TEXT}
              disabled={this.state.disabled}
              text={'send'}
              onPress={this.submit}
            />
          </View>
        </View>
      </View>
    )
  }

  updateText = (text: string) => {
    this.setState({
      textValue: text,
      disabled: this.isSubmitDisabled(text)
    })
    if (this.props.onMessageUpdate) {
      this.props.onMessageUpdate(text)
    }
  }

  submit = () => {
    const varname = null
    if (varname === undefined) {
    }
    if (typeof varname === 'undefined') {
    }
    if (varname == null) {
    }
    if (this.props.onSendMessage) {
      this.props.onSendMessage(this.state.textValue!)
    }
    this.setState({
      textValue: undefined,
      disabled: true
    })
  }

  public focus() {
    if (this.textInput) {
      this.textInput.focus()
    }
  }
}

export default AuthoringInput
