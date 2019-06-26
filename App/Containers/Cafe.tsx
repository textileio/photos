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

import { RootState, RootAction } from '../Redux/Types'
import { cafesActions } from '../features/cafes'

import Icon from '@textile/react-native-icon'
import { TextileHeaderButtons, Item } from '../Components/HeaderButtons'
import Button from '../Components/LargeButton'
import Separator from '../Components/Separator'

import { color, fontFamily, fontSize, spacing, size } from '../styles'

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

const ButtonContainer: ViewStyle = {
  width: Dimensions.get('window').width,
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center'
}

const DeregisterButton: ViewStyle = {
  backgroundColor: color.severe_3,
  marginTop: spacing._016
}

interface StateProps {
  processing: boolean
  error?: string
}

interface DispatchProps {
  deregister: (success: () => void) => void
}

interface NavProps {
  cafe: ICafeSession
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
    const services = ['Backup', 'Inboxing', 'Push Notifications']
    const { id } = this.props.navigation.getParam('cafe')
    const buttonDisabled = !this.props.error && this.props.processing
    return (
      <SafeAreaView style={Container}>
        <Text style={PeerId}>{id}</Text>
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
          ItemSeparatorComponent={() => <Separator />}
        />
        {this.props.error && <Text>{this.props.error}</Text>}
        <View style={ButtonContainer}>
          <Button
            text="Deregister"
            onPress={this.deregister}
            style={DeregisterButton}
            processing={buttonDisabled}
            disabled={buttonDisabled}
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
  const cafe = ownProps.navigation.getParam('cafe')
  const { id } = cafe
  const processingCafes = state.cafes.deregisterCafe
  const processing = Object.keys(processingCafes).indexOf(id) > -1
  return {
    processing,
    error: processing ? processingCafes[id].error : undefined
  }
}

const mapDispatchToProps = (
  dispatch: Dispatch<RootAction>,
  ownProps: NavigationScreenProps<NavProps>
): DispatchProps => {
  const cafe = ownProps.navigation.getParam('cafe')
  const { id } = cafe
  return {
    deregister: (success: () => void) =>
      dispatch(cafesActions.deregisterCafe.request({ id, success }))
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cafe)
