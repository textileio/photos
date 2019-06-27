import React, { Component } from 'react'
import { SafeAreaView, ViewStyle, FlatList } from 'react-native'
import { connect } from 'react-redux'

import { NavigationScreenProps } from 'react-navigation'
import { ICafeSession } from '@textile/react-native-sdk'
import { RootState } from '../Redux/Types'

import { Item, TextileHeaderButtons } from '../Components/HeaderButtons'
import Separator from '../Components/Separator'
import Cafe from '../Components/Cafe'

const CONTAINER: ViewStyle = {
  flex: 1
}

const CafesList: ViewStyle = {
  flex: 1
}

interface StateProps {
  sessions: ReadonlyArray<ICafeSession>
}

type Props = StateProps & NavigationScreenProps

class Cafes extends Component<Props> {
  static navigationOptions = ({ navigation }: NavigationScreenProps) => {
    const goBack = () => navigation.goBack()
    const goToCafeRegistration = () => navigation.navigate('RegisterCafe')
    const headerLeft = (
      <TextileHeaderButtons left={true}>
        <Item title="Back" onPress={goBack} iconName="arrow-left" />
      </TextileHeaderButtons>
    )
    const headerRight = (
      <TextileHeaderButtons>
        <Item title="Add Cafe" iconName="plus" onPress={goToCafeRegistration} />
      </TextileHeaderButtons>
    )
    return {
      headerLeft,
      headerTitle: 'Registered Cafes',
      headerRight
    }
  }

  render() {
    return (
      <SafeAreaView style={CONTAINER}>
        <FlatList
          style={CafesList}
          data={this.props.sessions}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          ItemSeparatorComponent={() => <Separator />}
        />
      </SafeAreaView>
    )
  }

  _renderItem = ({ item }: { item: ICafeSession }) => {
    return <Cafe peerId={item.id} onPress={() => this.onCafePress(item)} />
  }

  _keyExtractor = (item: ICafeSession) => item.id

  onCafePress = (cafe: ICafeSession) => {
    this.props.navigation.navigate('Cafe', {
      cafe
    })
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  return {
    sessions: state.account.cafeSessions.sessions
  }
}

export default connect(
  mapStateToProps,
  undefined
)(Cafes)
