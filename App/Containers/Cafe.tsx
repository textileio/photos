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
import { connect } from 'react-redux'
import { NavigationScreenProps } from 'react-navigation'
import { ICafeSession } from '@textile/react-native-sdk'

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

interface NavProps {
  cafe: ICafeSession
}

type Props = NavigationScreenProps<NavProps>

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
        <View style={ButtonContainer}>
          <Button
            text="Deregister"
            onPress={this.deregister}
            style={DeregisterButton}
          />
        </View>
      </SafeAreaView>
    )
  }

  deregister = () => {}
}

export default connect(
  undefined,
  undefined
)(Cafe)
