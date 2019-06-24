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
import Modal from 'react-native-modal'

import { RootState } from '../Redux/Types'

import Icon from '@textile/react-native-icon'
import CafesList from './CafesList'

import { color, size, spacing, fontFamily, fontSize } from '../styles'

const Container: ViewStyle = {
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'center',
  position: 'absolute',
  top: 0,
  bottom: 0,
  right: 0,
  left: 0,
  padding: 0,
  margin: 0,
  backgroundColor: color.screen_primary
}

const Header: TextStyle = {
  textAlign: 'center',
  fontFamily: fontFamily.bold,
  fontSize: fontSize._24,
  paddingVertical: spacing._024
}

const ListContainer: ViewStyle = {
  flex: 1
}

const Buttons: ViewStyle = {
  width: '100%',
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: spacing._024
}

const CancelButton: TextStyle = {
  fontFamily: fontFamily.regular
}

interface OwnProps {
  isVisible: boolean
  hide: () => void
}

interface StateProps {
  alreadyRegistered: ReadonlyArray<string>
}

type Props = OwnProps & StateProps

interface State {
  selected: string
}

class RegisterCafeModal extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      selected: ''
    }
  }

  render() {
    return (
      <Modal
        isVisible={this.props.isVisible}
        animationIn={'fadeInUp'}
        animationOut={'fadeOutDown'}
        avoidKeyboard={true}
        backdropOpacity={0.5}
        style={{ margin: 0, padding: 0 }}
      >
        <SafeAreaView style={Container}>
          <Text style={Header}>
            Register With a New Cafe
          </Text>
          <View style={ListContainer}>
            <CafesList
              selected={this.state.selected}
              onSelect={this.onSelect}
              alreadyRegistered={this.props.alreadyRegistered}
            />
          </View>
          <View style={Buttons}>
            <TouchableOpacity onPress={this.props.hide}>
              <Text style={CancelButton}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={this.props.hide}>
              <Icon name="arrow-right" size={size._032} />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
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
)(RegisterCafeModal)