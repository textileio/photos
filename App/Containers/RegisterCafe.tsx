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

type Props = StateProps & NavigationScreenProps

interface State {
  selected: string
}

class RegisterCafe extends Component<Props, State> {
  static navigationOptions = ({
    navigation
  }: NavigationScreenProps) => {
    const goBack = () => navigation.goBack()
    const headerLeft = (
      <TextileHeaderButtons left={true}>
        <Item title="Back" onPress={goBack} iconName="arrow-left" />
      </TextileHeaderButtons>
    )
    const headerRight = (
      <TextileHeaderButtons>
        <Item title="Search" onPress={() => { }} iconName="search" />
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
      selected: ''
    }
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