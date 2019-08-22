import React, { Component } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ViewStyle
} from 'react-native'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { NavigationScreenProps } from 'react-navigation'
import Icon from '@textile/react-native-icon'

import { RootState, RootAction } from '../Redux/Types'
import { Cafe } from '../features/cafes/models'
import { TextileEventsSelectors } from '../Redux/TextileEventsRedux'
import { cafesActions, cafesSelectors } from '../features/cafes'
import { Item, TextileHeaderButtons } from '../Components/HeaderButtons'
import CafesList from '../Components/CafesList'
import CafePeerIdModal from '../Components/CafePeerIdModal'
import Loading from '../Components/Loading'

import { size, spacing, color, fontSize } from '../styles'

const Container: ViewStyle = {
  flex: 1
}

const ListContainer: ViewStyle = {
  flex: 1
}

const Buttons: ViewStyle = {
  width: '100%',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  alignItems: 'center',
  padding: spacing._024
}

interface StateProps {
  alreadyRegistered: ReadonlyArray<string>
  registeringCafes: Cafe[]
  nodeOnline: boolean
  cafes: Cafe[]
}

interface DispatchProps {
  refreshKnownCafes: () => void
  register: (
    url: string,
    peerId: string,
    token: string,
    success: () => void
  ) => void
}

type Props = StateProps & DispatchProps & NavigationScreenProps

interface State {
  selected?: {
    url: string
    peerId: string
    token: string
  }
  peerIdModalIsVisible: boolean
}

class RegisterCafe extends Component<Props, State> {
  static navigationOptions = ({ navigation }: NavigationScreenProps) => {
    const backTo = navigation.getParam('backTo')
    const goBack = () => {
      if (backTo && backTo !== '') {
        navigation.navigate(backTo)
        return
      }
      navigation.goBack()
    }
    const headerLeft = (
      <TextileHeaderButtons left={true}>
        <Item title="Back" onPress={goBack} iconName="arrow-left" />
      </TextileHeaderButtons>
    )
    return {
      headerLeft,
      headerTitle: 'Available Bots'
    }
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      peerIdModalIsVisible: false
    }
  }
  componentWillMount() {
    this.props.refreshKnownCafes()
  }

  render() {
    const { peerId } = this.state.selected
      ? this.state.selected
      : { peerId: undefined }
    const registeringCafe = this.props.registeringCafes.find(
      cafe => cafe.peerId === peerId
    )
    const error = peerId && registeringCafe ? registeringCafe.error : undefined
    const registering = registeringCafe && !error
    const buttonDisabled = !this.state.selected || registering
    return (
      <SafeAreaView style={Container}>
        <View style={ListContainer}>
          {!this.props.nodeOnline && (
            <Loading
              color={color.brandBlue}
              text={'Waiting for node to be online...'}
            />
          )}
          {this.props.nodeOnline && (
            <CafesList
              cafes={this.props.cafes}
              disabled={registering}
              selected={peerId}
              onSelect={this.onSelect}
              alreadyRegistered={this.props.alreadyRegistered}
              onAddCustom={this.togglePeerIdModal}
            />
          )}
        </View>

        {error && (
          <View
            style={{
              backgroundColor: color.severe_6,
              padding: 12,
              margin: size._024,
              borderRadius: 8,
              height: 'auto'
            }}
          >
            <Text style={{ color: color.grey_2 }}>{error}</Text>
          </View>
        )}

        <View style={Buttons}>
          <TouchableOpacity
            disabled={buttonDisabled}
            onPress={this.register}
            style={{
              alignSelf: 'flex-end',
              alignContent: 'flex-end',
              justifyContent: 'flex-end'
            }}
          >
            {!error && (
              <Icon
                name="arrow-right"
                size={size._032}
                color={buttonDisabled ? color.grey_4 : color.grey_3}
              />
            )}
            {error && (
              <Text
                style={{
                  fontSize: fontSize._20,
                  color: buttonDisabled ? color.grey_4 : color.grey_2
                }}
              >
                Retry
              </Text>
            )}
          </TouchableOpacity>
        </View>
        <CafePeerIdModal
          isVisible={this.state.peerIdModalIsVisible}
          complete={this.registerByPeerId}
          close={this.togglePeerIdModal}
        />
      </SafeAreaView>
    )
  }

  onSelect = (url: string, peerId: string, token: string) => () => {
    // If already selected, deselect it
    this.setState(prevState => {
      const alreadySelected = prevState.selected
        ? prevState.selected.peerId === peerId
        : false
      return {
        selected: alreadySelected
          ? undefined
          : {
              url,
              peerId,
              token
            }
      }
    })
  }

  register = () => {
    if (this.state.selected) {
      const { url, peerId, token } = this.state.selected
      this.props.register(url, peerId, token, this.onSuccess)
    }
  }

  registerByPeerId = (url: string, peerId: string, token: string) => {
    this.setState({
      selected: {
        url,
        peerId,
        token
      },
      peerIdModalIsVisible: false
    })
    this.props.register(url, peerId, token, this.onSuccess)
  }

  togglePeerIdModal = () => {
    this.setState(prevState => {
      return {
        peerIdModalIsVisible: !prevState.peerIdModalIsVisible
      }
    })
  }

  onSuccess = () => {
    const backTo = this.props.navigation.getParam('backTo')
    if (backTo && backTo !== '') {
      this.props.navigation.navigate(backTo)
      return
    }
    this.props.navigation.goBack()
  }
}

function mapStateToProps(state: RootState): StateProps {
  const sessions = cafesSelectors.sessions(state.cafes)
  const cafes = cafesSelectors.knownCafes(state.cafes)
  return {
    alreadyRegistered: sessions.map(session => session.id),
    registeringCafes: cafesSelectors.registeringCafes(state.cafes),
    nodeOnline: TextileEventsSelectors.online(state),
    cafes
  }
}

function mapDispatchToProps(dispatch: Dispatch<RootAction>): DispatchProps {
  return {
    refreshKnownCafes: () => dispatch(cafesActions.getKnownCafes.request()),
    register: (
      url: string,
      peerId: string,
      token: string,
      success: () => void
    ) =>
      dispatch(
        cafesActions.registerCafe.request({
          url,
          peerId,
          token,
          success
        })
      )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterCafe)
