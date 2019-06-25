import React, { Component } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle
} from 'react-native'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { NavigationScreenProps } from 'react-navigation'

import { RootState, RootAction } from '../Redux/Types'
import { RegisterCafes } from '../features/cafes/reducer'

import { Item, TextileHeaderButtons } from '../Components/HeaderButtons'
import Icon from '@textile/react-native-icon'
import CafesList from '../Components/CafesList'
import CafePeerIdModal from '../Components/CafePeerIdModal'
import { cafesActions } from '../features/cafes'

import { size, spacing, fontFamily, fontSize } from '../styles'

const Container: ViewStyle = {
  flex: 1,
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center'
}

const ListContainer: ViewStyle = {
  flex: 1
}

const Buttons: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  padding: spacing._024
}

const CancelButton: TextStyle = {
  fontFamily: fontFamily.regular
}

interface StateProps {
  alreadyRegistered: ReadonlyArray<string>
  registeringCafes: RegisterCafes
}

interface DispatchProps {
  register: (url: string, token: string) => void
}

interface NavProps {
  openPeerIdModal: () => void
}

type Props = StateProps & DispatchProps & NavigationScreenProps<NavProps>

interface State {
  selected?: {
    url: string
    token: string
  }
  peerIdModalIsVisible: boolean
}

class RegisterCafe extends Component<Props, State> {
  static navigationOptions = ({
    navigation
  }: NavigationScreenProps<NavProps>) => {
    const goBack = () => navigation.goBack()
    const openPeerIdModal = navigation.getParam('openPeerIdModal')
    const headerLeft = (
      <TextileHeaderButtons left={true}>
        <Item title="Back" onPress={goBack} iconName="arrow-left" />
      </TextileHeaderButtons>
    )
    const headerRight = (
      <TextileHeaderButtons>
        <Item title="Search" onPress={openPeerIdModal} iconName="search" />
      </TextileHeaderButtons>
    )
    return {
      headerLeft,
      headerTitle: 'Register With a New Cafe',
      headerRight
    }
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      peerIdModalIsVisible: false
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      openPeerIdModal: this.togglePeerIdModal
    })
  }

  render() {
    const goBack = () => this.props.navigation.goBack()
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
    return (
      <SafeAreaView style={Container}>
        <View style={ListContainer}>
          <CafesList
            disabled={registering}
            selected={url}
            onSelect={this.onSelect}
            alreadyRegistered={this.props.alreadyRegistered}
          />
        </View>
        <View style={Buttons}>
          {error && <Text>{error}</Text>}
          <TouchableOpacity disabled={registering} onPress={goBack}>
            <Icon name="arrow-right" size={size._032} />
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

  onSelect = (url: string, token: string) => {
    // If already selected, deselect it
    const alreadySelected = this.setState(prevState => {
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

  registerByPeerId = (url: string, token: string) => {
    this.setState({
      selected: {
        url,
        token
      },
      peerIdModalIsVisible: false
    })
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
  const sessions = state.account.cafeSessions.sessions
  return {
    alreadyRegistered: sessions.map(session => session.id),
    registeringCafes: state.cafes.registerCafe
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => {
  return {
    register: (url: string, token: string) =>
      dispatch(
        cafesActions.registerCafe.request({
          url,
          token
        })
      )
  }
}

export default connect(
  mapStateToProps,
  undefined
)(RegisterCafe)
