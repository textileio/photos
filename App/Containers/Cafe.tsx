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
import { ICafeSession } from '@textile/react-native-sdk'
import moment from 'moment'

import { RootState, RootAction } from '../Redux/Types'
import { cafesActions, cafesSelectors } from '../features/cafes'

import Icon from '@textile/react-native-icon'
import { TextileHeaderButtons, Item } from '../Components/HeaderButtons'
import Button from '../Components/LargeButton'
import RowSeparator from '../Components/RowSeparator'

import {
  color,
  fontFamily,
  fontSize,
  textStyle,
  spacing,
  size
} from '../styles'

const Container: ViewStyle = {
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'flex-start'
}

const PeerId: TextStyle = {
  textAlign: 'center',
  fontFamily: fontFamily.bold,
  fontSize: fontSize._24,
  padding: spacing._016
}

const ServicesHeader: TextStyle = {
  textAlign: 'left',
  fontFamily: fontFamily.medium,
  fontSize: fontSize._20,
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
  fontFamily: fontFamily.medium,
  fontSize: fontSize._20,
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
  cafe: {
    processing: boolean
    error?: string
  }
  session: {
    processing: boolean
    error?: string
  }
}

interface DispatchProps {
  deregister: (success: () => void) => void
  refresh: () => void
}

interface NavProps {
  cafeSession: ICafeSession
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
    const cafeSession = this.props.navigation.getParam('cafeSession')
    const { cafe, exp } = cafeSession
    const { peer } = cafe
    const seconds = (exp.seconds as number) * 1000
    const expirationDate = moment(new Date(seconds)).format(
      'MMMM Do YYYY [at] h:mm a'
    )
    const refreshButtonDisabled = this.props.session.processing
    const deregisterButtonDisabled =
      !this.props.cafe.error && this.props.cafe.processing
    return (
      <SafeAreaView style={Container}>
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
        {this.props.cafe.error && (
          <Text style={Error}>Cafe error: {this.props.cafe.error}</Text>
        )}
        {this.props.session.error && (
          <Text style={Error}>
            Cafe session error: {this.props.session.error}
          </Text>
        )}
        <Text style={ExpirationDate}>
          Your session expires on {expirationDate}
        </Text>
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
  const { peer } = ownProps.navigation.getParam('cafeSession').cafe
  const cafe = cafesSelectors.makeCafeForPeerId(peer)(state.cafes)
  const cafeSession = cafesSelectors.makeCafeSessionForPeerId(peer)(state.cafes)
  const processing = cafe ? cafe.state === 'deregistering' : false
  return {
    cafe: {
      processing,
      error: processing ? cafe.error : undefined
    },
    session: {
      processing: cafeSession.processing,
      error: cafeSession.error
    }
  }
}

const mapDispatchToProps = (
  dispatch: Dispatch<RootAction>,
  ownProps: NavigationScreenProps<NavProps>
): DispatchProps => {
  const { peer } = ownProps.navigation.getParam('cafeSession').cafe
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
