import React, { Component } from 'react'
import { SafeAreaView, Text, ViewStyle, TextStyle, Alert } from 'react-native'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { RootState, RootAction } from '../Redux/Types'
import { TextileEventsSelectors } from '../Redux/TextileEventsRedux'
import { RegisterCafes } from '../features/cafes/reducer'
import { cafesActions } from '../features/cafes'

import CafesList from '../Components/CafesList'
import Button from '../Components/LargeButton'
import CafePeerIdModal from '../Components/CafePeerIdModal'
import Loading from '../Components/Loading'

import { spacing, textStyle, color } from '../styles'

const CONTAINER: ViewStyle = {
  flex: 1
}

const TITLE: TextStyle = {
  ...textStyle.header_l,
  marginTop: spacing._016,
  marginBottom: spacing._008,
  paddingHorizontal: spacing._016
}

const SUBTITLE: TextStyle = {
  ...textStyle.body_l,
  marginBottom: spacing._016,
  paddingHorizontal: spacing._016
}

const SUBMIT_BUTTON: ViewStyle = {
  marginTop: spacing._016,
  alignSelf: 'center'
}

interface OwnProps {
  onSuccess: () => void
}

interface StateProps {
  registeringCafes: RegisterCafes
  nodeOnline: boolean
}

interface DispatchProps {
  register: (peerId: string, token: string) => void
}

type Props = OwnProps & StateProps & DispatchProps

interface State {
  selected?: {
    peerId: string
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

  onSelect = (peerId: string, token: string) => () => {
    // If already selected, deselect it
    this.setState(prevState => {
      const alreadySelected = prevState.selected
        ? prevState.selected.peerId === peerId
        : false
      return {
        selected: alreadySelected
          ? undefined
          : {
              peerId,
              token
            }
      }
    })
  }

  render() {
    const { peerId } = this.state.selected
      ? this.state.selected
      : { peerId: undefined }
    const registrationStarted = peerId
      ? Object.keys(this.props.registeringCafes).indexOf(peerId) > -1
      : false
    const error =
      peerId && registrationStarted
        ? this.props.registeringCafes[peerId].error
        : undefined
    const registering = registrationStarted && !error
    const buttonDisabled = !this.state.selected || registering
    return (
      <SafeAreaView style={CONTAINER}>
        <Text style={TITLE}>Choose a Cafe</Text>
        <Text style={SUBTITLE}>
          Cafes are trustless, always-on nodes that assist the peer network.
        </Text>
        {!this.props.nodeOnline && (
          <Loading
            color={color.brandBlue}
            text={'Waiting for node to be online...'}
          />
        )}
        {this.props.nodeOnline && (
          <CafesList
            disabled={registering}
            selected={peerId}
            onSelect={this.onSelect}
            onAddCustom={this.togglePeerIdModal}
          />
        )}
        {error && <Text>{error}</Text>}
        <Button
          text="Register Cafe"
          onPress={this.onButtonPress}
          processing={registering}
          disabled={buttonDisabled}
          style={SUBMIT_BUTTON}
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
      const { peerId, token } = this.state.selected
      this.props.register(peerId, token)
    }
  }

  registerByPeerId = (peerId: string, token: string) => {
    this.setState({
      selected: {
        peerId,
        token
      },
      peerIdModalIsVisible: false
    })
    this.props.register(peerId, token)
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
    registeringCafes: state.cafes.registerCafe,
    nodeOnline: TextileEventsSelectors.online(state)
  }
}

const mapDispatchToProps = (
  dispatch: Dispatch<RootAction>,
  ownProps: OwnProps
): DispatchProps => {
  return {
    register: (peerId: string, token: string) =>
      dispatch(
        cafesActions.registerCafe.request({
          peerId,
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
