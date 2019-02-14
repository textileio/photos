import React, { Component } from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { View, Text, FlatList, ListRenderItemInfo } from 'react-native'
import { NavigationScreenProps, SafeAreaView } from 'react-navigation'
import uuid from 'uuid/v4'
import ActionSheet from 'react-native-actionsheet'
import moment from 'moment'

import { TextileHeaderButtons, Item as TextileHeaderButtonsItem } from '../../Components/HeaderButtons'
import KeyboardResponsiveContainer from '../../Components/KeyboardResponsiveContainer'
import AuthoringInput from '../../Components/authoring-input'
import Message from '../../Components/message'
import Join from '../../Components/join'
import { Item } from '../../features/group/models'
import { RootState, RootAction } from '../../Redux/Types'
import { feedItems } from '../../features/group/selectors'
import { groupActions } from '../../features/group'
import UIActions from '../../Redux/UIRedux'
import { color } from '../../styles'

const momentSpec: moment.CalendarSpec = {
  sameDay: 'LT',
  nextDay: '[Tomorrow] LT',
  nextWeek: 'MMM DD LT',
  lastDay: 'MMM DD LT',
  lastWeek: 'MMM DD LT',
  sameElse: 'MMM DD LT'
}

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
            time={moment(item.data.date).calendar(undefined, momentSpec)}
          />
        )
      }
      case 'leave':
      case 'join': {
        const word = item.type === 'join' ? 'joined' : 'left'
        return (
          <Join
            avatar={item.data.avatar}
            username={item.data.username || 'unknown'}
            message={`${word} ${this.props.groupName}`}
            time={moment(item.data.date).calendar(undefined, momentSpec)}
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
