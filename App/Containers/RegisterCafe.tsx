import React, { Component } from 'react'
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ViewStyle,
  TextStyle
} from 'react-native'
import { connect } from 'react-redux'
import { NavigationScreenProps } from 'react-navigation'

import { RootState } from '../Redux/Types'

import { Item, TextileHeaderButtons } from '../Components/HeaderButtons'
import Icon from '@textile/react-native-icon'
import CafesList from '../Components/CafesList'
import CafePeerIdModal from '../Components/CafePeerIdModal'

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
}

interface NavProps {
  openPeerIdModal: () => void
}

type Props = StateProps & NavigationScreenProps<NavProps>

interface State {
  selected: string
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
      selected: '',
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
    return (
      <SafeAreaView style={Container}>
        <View style={ListContainer}>
          <CafesList
            selected={this.state.selected}
            onSelect={this.onSelect}
            alreadyRegistered={this.props.alreadyRegistered}
          />
        </View>
        <View style={Buttons}>
          <TouchableOpacity onPress={goBack}>
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

  onSelect = (peerId: string) => {
    // If already selected, deselect it
    this.setState(prevState => {
      return {
        selected: prevState.selected === peerId ? '' : peerId
      }
    })
  }

  registerByPeerId = (peerId: string) => {
    this.setState({
      selected: peerId
    })
    this.togglePeerIdModal()
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
    alreadyRegistered: sessions.map(session => session.id)
  }
}

export default connect(
  mapStateToProps,
  undefined
)(RegisterCafe)
