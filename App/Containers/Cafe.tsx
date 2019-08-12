import React, { Component } from 'react'
import {
  View,
  SafeAreaView,
  Text,
  TextStyle,
  ViewStyle,
  FlatList,
  Dimensions
} from 'react-native'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { NavigationScreenProps } from 'react-navigation'
import { Cafe as CafeModel, CafeSessionData } from '../features/cafes/models'
import Textile, { ICafe } from '@textile/react-native-sdk'
import moment from 'moment'

import { RootState, RootAction } from '../Redux/Types'
import { cafesActions, cafesSelectors } from '../features/cafes'

import Icon from '@textile/react-native-icon'
import { TextileHeaderButtons, Item } from '../Components/HeaderButtons'
import Button from '../Components/LargeButton'
import RowSeparator from '../Components/RowSeparator'

import { color, textStyle, spacing, size } from '../styles'

const Container: ViewStyle = {
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'flex-start'
}

const URL: TextStyle = {
  ...textStyle.header_m,
  textAlign: 'left',
  paddingHorizontal: spacing._016,
  paddingTop: spacing._016
}

const PeerId: TextStyle = {
  ...textStyle.body_m,
  textAlign: 'left',
  paddingHorizontal: spacing._016,
  marginBottom: spacing._016
}

const ServicesHeader: TextStyle = {
  ...textStyle.header_s,
  textAlign: 'left',
  paddingLeft: spacing._016,
  marginBottom: spacing._008
}

const Service: ViewStyle = {
  width: Dimensions.get('window').width,
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  padding: spacing._016
}

const ServiceTitle: TextStyle = {
  textAlign: 'left'
}

const ExpirationDate: TextStyle = {
  ...textStyle.header_s,
  paddingHorizontal: spacing._016,
  marginTop: spacing._016
}

const ButtonsContainer: ViewStyle = {
  width: Dimensions.get('window').width,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center',
  marginTop: spacing._024,
  paddingHorizontal: spacing._016
}

const DeregisterButton: ViewStyle = {
  backgroundColor: color.severe_3
}

const RefreshButton: ViewStyle = {
  backgroundColor: color.action_3,
  marginRight: spacing._016
}

const Error: TextStyle = {
  color: color.severe_3,
  paddingHorizontal: spacing._016
}

interface StateProps {
  cafe?: CafeModel
  session?: CafeSessionData
}

interface DispatchProps {
  deregister: (success: () => void) => void
  refresh: () => void
}

interface NavProps {
  peerId: string
}

type Props = NavigationScreenProps<NavProps> & StateProps & DispatchProps

class Cafe extends Component<Props> {
  static navigationOptions = ({
    navigation
  }: NavigationScreenProps<NavProps>) => {
    const back = () => navigation.goBack()
    const headerLeft = (
      <TextileHeaderButtons left={true}>
        <Item title="Back" iconName="arrow-left" onPress={back} />
      </TextileHeaderButtons>
    )
    return {
      headerTitle: 'Cafe Details',
      headerLeft
    }
  }

  render() {
    // Hardcoded placeholder for services UI
    const services = ['Backup', 'Inboxing']
    let cafe: ICafe
    // const exp = this.props.session &&  this.props.session.session.exp

    let expirationDate = ''
    let peer = ''
    let url = ''
    let refreshButtonDisabled = true
    let deregisterButtonDisabled = true
    if (this.props.session) {
      const { exp } = this.props.session.session
      const date = Textile.util.timestampToDate(exp)
      expirationDate = moment(date).format('MMMM Do YYYY [at] h:mm a')
      refreshButtonDisabled = this.props.session.processing
      cafe = this.props.session.session.cafe
      peer = cafe.peer
      url = cafe.url
    }
    if (this.props.cafe) {
      const cafeProcessing =
        this.props.cafe && this.props.cafe.state === 'deregistering'
      deregisterButtonDisabled = !this.props.cafe.error && cafeProcessing
    }

    return (
      <SafeAreaView style={Container}>
        <Text style={URL}>{url}</Text>
        <Text style={PeerId}>{peer}</Text>
        <Text style={ServicesHeader}>Services</Text>
        <FlatList
          data={services}
          keyExtractor={(item: string) => item}
          renderItem={({ item }) => (
            <View style={Service}>
              <Text style={ServiceTitle}>{item}</Text>
              <Icon name="check-mark" size={size._016} />
            </View>
          )}
          ItemSeparatorComponent={RowSeparator}
        />
        {this.props.cafe && this.props.cafe.error && (
          <Text style={Error}>Cafe error: {this.props.cafe.error}</Text>
        )}
        {this.props.session && this.props.session.error && (
          <Text style={Error}>
            Cafe session error: {this.props.session.error}
          </Text>
        )}
        {expirationDate !== '' && (
          <Text style={ExpirationDate}>
            Your session expires on {expirationDate}
          </Text>
        )}
        <View style={ButtonsContainer}>
          <Button
            text="Refresh"
            onPress={this.props.refresh}
            style={RefreshButton}
            processing={refreshButtonDisabled}
            disabled={refreshButtonDisabled}
          />
          <Button
            text="Deregister"
            onPress={this.deregister}
            style={DeregisterButton}
            processing={deregisterButtonDisabled}
            disabled={deregisterButtonDisabled}
          />
        </View>
      </SafeAreaView>
    )
  }

  deregister = () => {
    const goBack = () => this.props.navigation.goBack()
    this.props.deregister(goBack)
  }
}

const mapStateToProps = (
  state: RootState,
  ownProps: NavigationScreenProps<NavProps>
): StateProps => {
  const peer = ownProps.navigation.getParam('peerId')
  const cafe = cafesSelectors.makeCafeForPeerId(peer)(state.cafes)
  const session = cafesSelectors.makeCafeSessionForPeerId(peer)(state.cafes)
  return {
    cafe,
    session
  }
}

const mapDispatchToProps = (
  dispatch: Dispatch<RootAction>,
  ownProps: NavigationScreenProps<NavProps>
): DispatchProps => {
  const peer = ownProps.navigation.getParam('peerId')
  return {
    deregister: (success: () => void) =>
      dispatch(cafesActions.deregisterCafe.request({ peerId: peer, success })),
    refresh: () => {
      dispatch(cafesActions.refreshCafeSession.request({ peerId: peer }))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cafe)
