import React, { Component } from 'react'
import { SafeAreaView, View, Text, FlatList } from 'react-native'
import { connect } from 'react-redux'

import { NavigationScreenProps } from 'react-navigation'
import { ICafeSession } from '@textile/react-native-sdk'
import { RootState } from '../Redux/Types'

import { Item, TextileHeaderButtons } from '../Components/HeaderButtons'
import Separator from '../Components/Separator'
import Cafe from '../Components/Cafe'
import RegisterCafeModal from '../Components/RegisterCafeModal'

interface NavProps {
  openAddCafeModal: () => void
}

interface StateProps {
  sessions: ReadonlyArray<ICafeSession>
}

type Props = StateProps & NavigationScreenProps<NavProps>

interface State {
  isModalVisible: boolean
}

class Cafes extends Component<Props, State> {
  static navigationOptions = ({
    navigation
  }: NavigationScreenProps<NavProps>) => {
    const goBack = () => navigation.goBack()
    const openAddCafeModal = navigation.getParam('openAddCafeModal')
    const headerLeft = (
      <TextileHeaderButtons left={true}>
        <Item title="Back" onPress={goBack} iconName="arrow-left" />
      </TextileHeaderButtons>
    )
    const headerRight = (
      <TextileHeaderButtons>
        <Item title="Add Cafe" iconName="plus" onPress={openAddCafeModal} />
      </TextileHeaderButtons>
    )
    return {
      headerLeft,
      headerTitle: 'Registered Cafes',
      headerRight
    }
  }

  constructor(props: Props) {
    super(props)
    this.state = {
      isModalVisible: false
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      openAddCafeModal: this.toggleAddCafeModal
    })
  }

  render() {
    return (
      <SafeAreaView>
        <FlatList
          data={this.props.sessions}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          ItemSeparatorComponent={() => <Separator />}
        />
        <RegisterCafeModal
          isVisible={this.state.isModalVisible}
          hide={this.toggleAddCafeModal}
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

  toggleAddCafeModal = () => {
    this.setState((prevState) => {
      return {
        isModalVisible: !prevState.isModalVisible
      }
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
