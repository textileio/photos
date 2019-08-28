import React, { Component } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle
} from 'react-native'
import Modal from 'react-native-modal'

import Input from '../SB/components/Input'

import { color, fontFamily, fontSize, spacing, size } from '../styles'

const ModalView: ViewStyle = {
  position: 'absolute',
  top: 0,
  bottom: 0,
  right: 0,
  left: 0,
  padding: 0,
  margin: 0
}

const Container: ViewStyle = {
  flex: 1,
  backgroundColor: color.screen_primary,
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'stretch'
}

const Header: TextStyle = {
  textAlign: 'center',
  fontFamily: fontFamily.bold,
  fontSize: fontSize._24,
  paddingVertical: spacing._024
}

const InputContainer: ViewStyle = {
  flexDirection: 'row',
  paddingHorizontal: spacing._024,
  paddingBottom: spacing._024
}

const InputStyle: ViewStyle = {
  height: size._048
}

const Buttons: ViewStyle = {
  flexDirection: 'row',
  justifyContent: 'space-around',
  alignItems: 'center',
  paddingTop: spacing._024
}

const CancelButton: TextStyle = {
  fontFamily: fontFamily.regular,
  color: color.grey_3
}

const SubmitButton: TextStyle = {
  fontFamily: fontFamily.regular,
  color: color.brandBlue
}

const DisabledButton: TextStyle = {
  color: color.grey_4
}

interface OwnProps {
  isVisible: boolean
  complete: (url: string, peerId: string, token: string) => void
  close: () => void
}

type Props = OwnProps

interface State {
  url: string
  peerId: string
  token: string
}

export default class CafePeerIdModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      url: '',
      peerId: '',
      token: ''
    }
  }

  render() {
    const peerIdInputIsBlank = this.state.peerId === ''
    const tokenInputIsBlank = this.state.token === ''
    const urlInputIsBlank = this.state.url === ''
    // TODO: This modal floats with a weird gap at the top, added a quickfix of maxHeight to make
    // it look 'on purpose'. Better fix needed
    return (
      <Modal
        isVisible={this.props.isVisible}
        animationIn={'fadeInUp'}
        animationOut={'fadeOutDown'}
        avoidKeyboard={true}
        backdropOpacity={0.5}
        style={{ margin: 0, padding: 0, maxHeight: 600 }}
      >
        <SafeAreaView style={ModalView}>
          <View style={Container}>
            <Text style={Header}>Custom Bot</Text>
            <View style={InputContainer}>
              <Input
                style={InputStyle}
                value={this.state.peerId}
                label={peerIdInputIsBlank ? 'Peer ID...' : ''}
                onChangeText={this.handleNewPeerId}
              />
            </View>
            <View style={InputContainer}>
              <Input
                style={InputStyle}
                value={this.state.token}
                label={tokenInputIsBlank ? 'Token...' : ''}
                onChangeText={this.handleNewToken}
              />
            </View>
            <View style={InputContainer}>
              <Input
                style={InputStyle}
                value={this.state.url}
                label={urlInputIsBlank ? 'URL...' : ''}
                onChangeText={this.handleNewUrl}
              />
            </View>
            <View style={Buttons}>
              <TouchableOpacity onPress={this.props.close}>
                <Text style={CancelButton}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={
                  peerIdInputIsBlank || tokenInputIsBlank || urlInputIsBlank
                }
                onPress={() =>
                  this.props.complete(
                    this.state.url,
                    this.state.peerId,
                    this.state.token
                  )
                }
              >
                <Text
                  style={[
                    SubmitButton,
                    (peerIdInputIsBlank ||
                      tokenInputIsBlank ||
                      urlInputIsBlank) &&
                      DisabledButton
                  ]}
                >
                  Submit
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    )
  }

  handleNewPeerId = (peerId: string) => {
    this.setState({
      peerId
    })
  }

  handleNewToken = (token: string) => {
    this.setState({
      token
    })
  }

  handleNewUrl = (url: string) => {
    this.setState({
      url
    })
  }
}
