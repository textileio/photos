import React from 'react'
import {Dispatch} from 'redux'
import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux'
import { FlatList, View, Text, TouchableOpacity, Alert } from 'react-native'

import {RootAction, RootState} from '../Redux/Types'

import { getThreads } from '../Redux/PhotoViewingSelectors'
import { contactsSelectors } from '../features/contacts'
import UIActions from '../Redux/UIRedux'
import TextileEventsActions from '../Redux/TextileEventsRedux'
import PreferencesActions from '../Redux/PreferencesRedux'

import { pb } from '@textile/react-native-sdk'

import { Item, TextileHeaderButtons } from '../Components/HeaderButtons'
import Avatar from '../Components/Avatar'
import GroupCard from '../Components/GroupCard'
import CreateThreadModal from '../Components/CreateThreadModal'
import styles from './Styles/GroupsStyles'

interface GroupAuthors {
  readonly id: string
  readonly name: string
  readonly size: number
  readonly members: pb.IContact[]
  readonly thumb?: pb.IFiles
}

interface StateProps {
  threads: ReadonlyArray<GroupAuthors>
  showNotificationsPrompt: boolean
}

interface DispatchProps {
  refreshMessages: () => void
  navigateToThread: (id: string, name: string) => void
  enableNotifications: () => void
  completeNotifications: () => void
}

interface NavProps {
  openDrawer: () => void,
  openThreadModal: () => void
}

type Props = StateProps & DispatchProps & NavigationScreenProps<NavProps>

interface State {
  showCreateGroupModal: boolean
}

class Groups extends React.Component<Props, State> {

  static navigationOptions = ({ navigation }: NavigationScreenProps<NavProps>) => {
    const openDrawer = navigation.getParam('openDrawer')
    const openThreadModal = navigation.getParam('openThreadModal')
    const headerLeft = (
      <TextileHeaderButtons left={true}>
        <Item
          title='Account'
          onPress={openDrawer}
          ButtonElement={<Avatar style={{ width: 24, height: 24 }} self={true} />}
          buttonWrapperStyle={{ margin: 11 }}
        />
      </TextileHeaderButtons>
    )

    const headerRight = (
      <TextileHeaderButtons>
        <Item title='Add Group' iconName='plus' onPress={openThreadModal} />
      </TextileHeaderButtons>
    )

    return {
      headerTitle: 'Groups',
      headerLeft,
      headerRight
    }
  }

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

  _renderItem = (rowData: any) => {
    const item: GroupAuthors = rowData.item
    return (
      <GroupCard id={item.id} {...item} onPress={this._onPressItem} />
    )
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

  _keyExtractor = (item: GroupAuthors) => item.id

  openThreadModal = () => {
    this.setState({ showCreateGroupModal: true })
  }

  cancelCreateThread = () => {
    this.setState({ showCreateGroupModal: false })
  }

  completeCreateThread = () => {
    this.setState({ showCreateGroupModal: false })
  }

  componentDidMount () {
    this.props.navigation.setParams({
      openDrawer: this.openDrawer,
      openThreadModal: this.openThreadModal
    })
  }

  componentDidUpdate (prevProps, prevState) {
    // ensure that it only gets called once by using the first update of the state or a new group add
    if (this.props.threads.length && this.props.threads.length !== prevProps.threads.length && this.props.showNotificationsPrompt) {
      this.notificationPrompt()
    }
  }

  render () {
    return (
      <View style={styles.contentContainer} >
        <FlatList
          data={this.props.threads}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          refreshing={false}
          onRefresh={this._onRefresh}
          initialNumToRender={4}
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
      </View>
    )
  }

  // Simple Alert based prompt to get Notification permissions
  notificationPrompt () {
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

const mapStateToProps = (state: RootState): StateProps => {
  const ownAddress = state.account.address.value
  const profile = state.account.profile.value
  let memberCount = 0
  const threads = getThreads(state, 'date')
  .map((thread) => {
    const selector = contactsSelectors.makeByThreadId(thread.id)
    const members = selector(state.contacts).filter((contact) => contact.address !== ownAddress)
    if (profile && members.length < 8) {
      members.unshift(profile)
    }
    const thumb = thread.photos.length ? thread.photos[0] : undefined
    // just get a sense of how many group x members there are
    memberCount += members.length
    return {
      id: thread.id,
      name: thread.name,
      // total number of images in the thread
      size: thread.photos.length,
      members,
      thumb
    }
  })

  const showNotificationsPrompt = state.preferences.tourScreens.notifications &&
    threads.length > 0 &&
    memberCount > threads.length

  return {
    threads,
    showNotificationsPrompt
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => {
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

export default connect(mapStateToProps, mapDispatchToProps)(Groups)
