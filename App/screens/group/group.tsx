import React, { Component } from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { View, Text, FlatList, ListRenderItemInfo } from 'react-native'
import { NavigationScreenProps, SafeAreaView } from 'react-navigation'
import uuid from 'uuid/v4'

import { TextileHeaderButtons, Item as TextileHeaderButtonsItem } from '../../Components/HeaderButtons'
import KeyboardResponsiveContainer from '../../Components/KeyboardResponsiveContainer'
import AuthoringInput from '../../Components/AuthoringInput'
import Message from '../../Components/Message'
import { Item } from '../../features/group/models'
import { RootState, RootAction } from '../../Redux/Types'
import { feedItems } from '../../features/group/selectors'
import { groupActions } from '../../features/group'
import UIActions from '../../Redux/UIRedux'
import { color } from '../../styles';

interface StateProps {
  items: ReadonlyArray<Item>,
  groupName: string
}

interface DispatchProps {
  refresh: () => void
  sendMessage: (message: string) => void
  showWalletPicker: () => void
}

interface NavProps {
  threadId: string,
  groupName: string
}

type Props = StateProps & DispatchProps & NavigationScreenProps<NavProps>

class Group extends Component<Props> {

  static navigationOptions = ({ navigation }: NavigationScreenProps<NavProps>) => {
    // const openDrawer = navigation.getParam('openDrawer')
    // const addContact = navigation.getParam('addContact')
    const groupName = navigation.getParam('groupName')
    const back = () => navigation.goBack()
    const headerLeft = (
      <TextileHeaderButtons left={true}>
        <TextileHeaderButtonsItem title='Back' iconName='arrow-left' onPress={back} />
      </TextileHeaderButtons>
    )
    return {
      headerLeft,
      headerTitle: groupName
    }
  }

  componentDidMount() {
    this.props.navigation.addListener('willFocus', this.onFocus)
    this.props.navigation.setParams({
      groupName: this.props.groupName
    })
  }

  render () {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardResponsiveContainer>
          <FlatList
            style={{ flex: 1, backgroundColor: color.screen_primary }}
            inverted={true}
            data={this.props.items}
            renderItem={this.renderRow}
          />
          <AuthoringInput containerStyle={{ }} onSendMessage={this.submit} onSharePhoto={this.props.showWalletPicker} />
        </KeyboardResponsiveContainer>
      </SafeAreaView>
    )
  }

  renderRow = ({ item }: ListRenderItemInfo<Item>) => {
    switch (item.type) {
      case 'message': {
        return (
          <Message
            avatar={item.data.avatar}
            username={item.data.username || 'unknown'}
            message={item.data.body}
          />
        )
      }
      case 'join': {
        return (
          <Message
            avatar={item.data.avatar}
            username={item.data.username || 'unknown'}
            message={'joined'}
          />
        )
      }
      default:
        return <Text>{`${item.type} - ${item.key}`}</Text>
    }
  }

  submit = (message: string) => this.props.sendMessage(message)

  onFocus = () => {
    this.props.refresh()
  }
}

const mapStateToProps = (state: RootState, ownProps: NavigationScreenProps<NavProps>): StateProps => {
  const threadId = ownProps.navigation.getParam('threadId')
  const items = feedItems(state.group, threadId) || []
  const threadData = state.photoViewing.threads[threadId]
  const groupName = threadData ? threadData.name : 'Unknown'
  return {
    items,
    groupName
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>, ownProps: NavigationScreenProps<NavProps>): DispatchProps => {
  const threadId = ownProps.navigation.getParam('threadId')
  return {
    refresh: () => dispatch(groupActions.feed.refreshFeed.request({ id: threadId })),
    sendMessage: (message: string) => dispatch(groupActions.addMessage.addMessage.request({ id: uuid(), groupId: threadId, body: message })),
    // TODO: look at just doing direct navigation for this
    showWalletPicker: () => { dispatch(UIActions.showWalletPicker(threadId)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Group)
