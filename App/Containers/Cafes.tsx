import React, { Component } from 'react'
import { SafeAreaView, ViewStyle, FlatList } from 'react-native'
import { connect } from 'react-redux'

import { NavigationScreenProps } from 'react-navigation'
import { ICafeSession } from '@textile/react-native-sdk'
import { RootState } from '../Redux/Types'

import { Item, TextileHeaderButtons } from '../Components/HeaderButtons'
import RowSeparator from '../Components/RowSeparator'
import ListItem from '../Components/ListItem'
import { cafesSelectors } from '../features/cafes'

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
      headerTitle: 'Registered Bots',
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
          ItemSeparatorComponent={RowSeparator}
        />
      </SafeAreaView>
    )
  }

  _renderItem = ({ item }: { item: ICafeSession }) => {
    const re = /\-/gi // eslint-disable-line
    const title = item.cafe.url
      .split('//')
      .reverse()[0]
      .split('.')[0]
      .replace(re, ' ') as string
    return (
      <ListItem
        title={`storage bot: ${title}`}
        subtitle={item.cafe.url}
        showDisclosure={true}
        onPress={this.onCafePress(item)}
      />
    )
  }

  _keyExtractor = (item: ICafeSession) => item.id

  onCafePress = (cafeSession: ICafeSession) => () => {
    this.props.navigation.navigate('Cafe', {
      peerId: cafeSession.id
    })
  }
}

function mapStateToProps(state: RootState): StateProps {
  return {
    sessions: cafesSelectors.sessions(state.cafes)
  }
}

export default connect(
  mapStateToProps,
  undefined
)(Cafes)
