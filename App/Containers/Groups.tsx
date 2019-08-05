import React from 'react'
import { Dispatch } from 'redux'
import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux'
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  Alert,
  ListRenderItemInfo
} from 'react-native'
import Toast from 'react-native-easy-toast'

import { RootAction, RootState } from '../Redux/Types'

import { inboundInvites } from '../Redux/ThreadsSelectors'
import { InboundInvite } from '../Redux/ThreadsRedux'
import {
  getThreadsAndMembers,
  GroupAuthors
} from '../Redux/GroupsSelectors'
import UIActions from '../Redux/UIRedux'
import TextileEventsActions from '../Redux/TextileEventsRedux'
import PreferencesActions, {
  PreferencesSelectors
} from '../Redux/PreferencesRedux'

import { Item, TextileHeaderButtons } from '../Components/HeaderButtons'
import Avatar from '../Components/Avatar'
import GroupCard from '../Components/GroupCard'
import CreateThreadModal from '../Components/CreateThreadModal'
import ProcessingThread from '../Components/ProcessingThread'
import styles from './Styles/GroupsStyles'

interface StateProps {
  groups: ReadonlyArray<GroupRows>
  showNotificationsPrompt: boolean
  itemCount: number
}

interface DispatchProps {
  refreshMessages: () => void
  navigateToThread: (id: string, name: string) => void
  enableNotifications: () => void
  completeNotifications: () => void
}

interface NavProps {
  openDrawer: () => void
  openThreadModal: () => void
}
type Props = StateProps & DispatchProps & NavigationScreenProps<NavProps>

interface State {
  showCreateGroupModal: boolean
}

class Groups extends React.PureComponent<Props, State> {
  static navigationOptions = ({
    navigation
  }: NavigationScreenProps<NavProps>) => {
    const openDrawer = navigation.getParam('openDrawer')
    const openThreadModal = navigation.getParam('openThreadModal')
    const headerLeft = (
      <TextileHeaderButtons left={true}>
        <Item
          title="Account"
          onPress={openDrawer}
          ButtonElement={
            <Avatar style={{ width: 24, height: 24 }} self={true} />
          }
          buttonWrapperStyle={{ margin: 11 }}
        />
      </TextileHeaderButtons>
    )

    const headerRight = (
      <TextileHeaderButtons>
        <Item title="Add Group" iconName="plus" onPress={openThreadModal} />
      </TextileHeaderButtons>
    )

    return {
      headerTitle: 'Groups',
      headerLeft,
      headerRight
    }
  }

  toast?: Toast

  constructor(props: Props) {
    super(props)
    this.state = {
      showCreateGroupModal: false
    }
  }

  _onPressItem = (threadCardProps: any) => {
    const { id, name } = threadCardProps
    this.props.navigateToThread(id, name)
  }

  openDrawer = () => {
    this.props.navigation.openDrawer()
  }

  _renderItem = (rowData: ListRenderItemInfo<GroupRows>) => {
    const item: GroupRows = rowData.item
    if (item.group) {
      return (
        <GroupCard
          id={item.group.id}
          {...item.group}
          onPress={this._onPressItem}
          onPressInvalid={this.displayThreadInvalidMessage}
        />
      )
    } else if (item.invite) {
      return <ProcessingThread {...item.invite} />
    }
    return <View />
  }

  _renderFooter = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.95}
        style={styles.createThreadBox}
        onPress={this.openThreadModal}
      >
        <Text style={styles.createThreadText}>Create New Group</Text>
      </TouchableOpacity>
    )
  }

  _onRefresh = () => {
    this.props.refreshMessages()
  }

  _keyExtractor = (item: GroupRows) => item.id

  openThreadModal = () => {
    this.setState({ showCreateGroupModal: true })
  }

  cancelCreateThread = () => {
    this.setState({ showCreateGroupModal: false })
  }

  completeCreateThread = () => {
    this.setState({ showCreateGroupModal: false })
  }

  displayThreadInvalidMessage = () => {
    if (this.toast) {
      this.toast.show(
        'This group contains invald data. It may not work correctly and you should probably delete it.',
        3000
      )
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      openDrawer: this.openDrawer,
      openThreadModal: this.openThreadModal
    })
  }

  componentDidUpdate(prevProps: Props) {
    if (
      this.props.groups.length &&
      this.props.groups.length !== prevProps.groups.length &&
      this.props.showNotificationsPrompt
    ) {
      // ensure that it only gets called once by using the first update of the state or a new group add
      this.notificationPrompt()
    }
  }

  render() {
    return (
      <View style={styles.contentContainer}>
        <FlatList
          data={this.props.groups}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          refreshing={false}
          onRefresh={this._onRefresh}
          ListFooterComponent={this._renderFooter}
        />
        <CreateThreadModal
          isVisible={this.state.showCreateGroupModal}
          fullScreen={false}
          selectToShare={false}
          navigateTo={true}
          cancel={this.cancelCreateThread}
          complete={this.completeCreateThread}
        />
        <Toast
          ref={toast => {
            this.toast = toast ? toast : undefined
          }}
          position="center"
        />
      </View>
    )
  }

  // Simple Alert based prompt to get Notification permissions
  notificationPrompt() {
    // never show it again
    this.props.completeNotifications()
    // give the user a prompt
    Alert.alert(
      'Notifications',
      'Want to receive notifications when you receive new photos or invites?',
      [
        {
          text: 'Yes please',
          onPress: () => {
            this.props.enableNotifications()
          }
        },
        { text: 'Not now', style: 'cancel' },
        {
          text: 'Show all options',
          onPress: () => {
            this.props.navigation.navigate('Settings')
          }
        }
      ],
      { cancelable: false }
    )
  }
}

interface GroupRows {
  group?: GroupAuthors
  invite?: InboundInvite
  id: string
}

function mapStateToProps(state: RootState): StateProps {
  const threads: GroupAuthors[] = getThreadsAndMembers(state, 8)
  const memberCount = threads.reduce((prev, thread) => {
    return prev + thread.memberCount
  }, 0)
  const itemCount = threads.reduce((prev, thread) => {
    return prev + thread.size
  }, 0)

  const showNotificationsPrompt =
    PreferencesSelectors.showNotificationPrompt(state) &&
    threads.length > 0 &&
    memberCount > threads.length

  const invites: GroupRows[] = inboundInvites(state).map(inbound => ({
    invite: inbound,
    id: inbound.inviteId
  }))

  const nestedThreads = threads.map(thread => ({
    group: thread,
    id: thread.id
  }))
  const groups: ReadonlyArray<GroupRows> = [...invites, ...nestedThreads]

  return {
    groups,
    showNotificationsPrompt,
    itemCount
  }
}

function mapDispatchToProps(dispatch: Dispatch<RootAction>): DispatchProps {
  return {
    refreshMessages: () => {
      dispatch(TextileEventsActions.refreshMessagesRequest())
    },
    navigateToThread: (id: string, name: string) => {
      dispatch(UIActions.navigateToThreadRequest(id, name))
    },
    enableNotifications: () => {
      dispatch(PreferencesActions.toggleServicesRequest('notifications', true))
    },
    completeNotifications: () => {
      dispatch(PreferencesActions.completeTourSuccess('notifications'))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Groups)
