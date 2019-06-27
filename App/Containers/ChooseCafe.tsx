import React, { Component } from 'react'
import { SafeAreaView, Text, ViewStyle, TextStyle, Alert } from 'react-native'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { RootState, RootAction } from '../Redux/Types'
import { RegisterCafes } from '../features/cafes/reducer'
import { cafesActions } from '../features/cafes'

import CafesList from '../Components/CafesList'
import Button from '../Components/LargeButton'
import CafeListHeader from '../Components/CafeListHeader'
import CafePeerIdModal from '../Components/CafePeerIdModal'

import { color, fontFamily, fontSize, spacing } from '../styles'

const Container: ViewStyle = {
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  flex: 1
}

const Header: TextStyle = {
  fontFamily: fontFamily.bold,
  textAlign: 'center',
  fontSize: fontSize._36,
  color: color.grey_0,
  marginTop: spacing._024,
  marginBottom: spacing._016
}

const Subheader: TextStyle = {
  fontFamily: fontFamily.regular,
  fontSize: fontSize._20,
  paddingHorizontal: spacing._024,
  marginBottom: spacing._016
}

const SubmitButton: ViewStyle = {
  marginTop: spacing._016
}

interface OwnProps {
  onSuccess: () => void
}

interface StateProps {
  registeringCafes: RegisterCafes
}

interface DispatchProps {
  register: (url: string, token: string) => void
}

type Props = OwnProps & StateProps & DispatchProps

interface State {
  selected?: {
    url: string
    token: string
  }
  peerIdModalIsVisible: boolean
}

class ChooseCafe extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      peerIdModalIsVisible: false
    }
  }

  onSelect = (url: string, token: string) => {
    // If already selected, deselect it
    this.setState(prevState => {
      const alreadySelected = prevState.selected
        ? prevState.selected.url === url
        : false
      return {
        selected: alreadySelected
          ? undefined
          : {
              url,
              token
            }
      }
    })
  }

  render() {
    const { url } = this.state.selected
      ? this.state.selected
      : { url: undefined }
    const registrationStarted = url
      ? Object.keys(this.props.registeringCafes).indexOf(url) > -1
      : false
    const error =
      url && registrationStarted
        ? this.props.registeringCafes[url].error
        : undefined
    const registering = registrationStarted && !error
    const buttonDisabled = !this.state.selected || registering
    return (
      <SafeAreaView style={Container}>
        <Text style={Header}>Choose a Cafe</Text>
        <Text style={Subheader}>
          Cafes are trustless, always-on nodes that assist the peer network.
          (This step is optional.)
        </Text>
        <CafesList
          disabled={registering}
          selected={url}
          onSelect={this.onSelect}
          ListHeaderComponent={
            <CafeListHeader onPress={this.togglePeerIdModal} />
          }
        />
        {error && <Text>{error}</Text>}
        <Button
          text="Continue"
          onPress={this.onButtonPress}
          processing={registering}
          disabled={buttonDisabled}
          style={SubmitButton}
        />
        <CafePeerIdModal
          isVisible={this.state.peerIdModalIsVisible}
          complete={this.registerByPeerId}
          close={this.togglePeerIdModal}
        />
      </SafeAreaView>
    )
  }

  onButtonPress = () => {
    if (!this.state.selected) {
      Alert.alert(
        'Are you sure?',
        'Do you want to proceed without registering with a cafe?',
        [
          {
            text: 'Go back',
            style: 'cancel'
          },
          {
            text: 'Continue',
            onPress: () => this.props.onSuccess()
          }
        ]
      )
    } else {
      const { url, token } = this.state.selected
      this.props.register(url, token)
    }
  }

  registerByPeerId = (url: string, token: string) => {
    this.setState({
      selected: {
        url,
        token
      },
      peerIdModalIsVisible: false
    })
    this.props.register(url, token)
  }

  togglePeerIdModal = () => {
    this.setState(prevState => {
      return {
        peerIdModalIsVisible: !prevState.peerIdModalIsVisible
      }
    })
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    registeringCafes: state.cafes.registerCafe
  }
}

const mapDispatchToProps = (
  dispatch: Dispatch<RootAction>,
  ownProps: OwnProps
): DispatchProps => {
  return {
    register: (url: string, token: string) =>
      dispatch(
        cafesActions.registerCafe.request({
          url,
          token,
          success: ownProps.onSuccess
        })
      )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChooseCafe)
