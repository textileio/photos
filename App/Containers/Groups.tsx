import React from 'react'
import {Dispatch} from 'redux'
import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux'
import { FlatList, View, Text, TouchableOpacity, Alert, Platform, ListRenderItemInfo } from 'react-native'

import {RootAction, RootState} from '../Redux/Types'

import { getThreadsAndMembers, GroupAuthors } from '../Redux/PhotoViewingSelectors'
import UIActions from '../Redux/UIRedux'
import TextileEventsActions from '../Redux/TextileEventsRedux'
import PreferencesActions, { PreferencesSelectors } from '../Redux/PreferencesRedux'

import { Item, TextileHeaderButtons } from '../Components/HeaderButtons'
import Avatar from '../Components/Avatar'
import GroupCard from '../Components/GroupCard'
import CreateThreadModal from '../Components/CreateThreadModal'
import styles from './Styles/GroupsStyles'

interface StateProps {
  threads: ReadonlyArray<GroupAuthors>
  showNotificationsPrompt: boolean
  showLocationPrompt: boolean
  itemCount: number
}

interface DispatchProps {
  refreshMessages: () => void
  navigateToThread: (id: string, name: string) => void
  enableNotifications: () => void
  completeNotifications: () => void
  completeBackgroundLocation: () => void
  enableLocation: () => void
}

interface NavProps {
  openDrawer: () => void,
  openThreadModal: () => void
}

type Props = StateProps & DispatchProps & NavigationScreenProps<NavProps>

interface State {
  showCreateGroupModal: boolean
}

class Groups extends React.PureComponent<Props, State> {

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

  _renderItem = (rowData: ListRenderItemInfo<GroupAuthors>) => {
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

  componentDidMount() {
    this.props.navigation.setParams({
      openDrawer: this.openDrawer,
      openThreadModal: this.openThreadModal
    })
  }

  componentDidUpdate(prevProps) {
    if (this.props.threads.length && this.props.threads.length !== prevProps.threads.length && this.props.showNotificationsPrompt) {
      // ensure that it only gets called once by using the first update of the state or a new group add
      this.notificationPrompt()
    } else if (this.props.threads.length && this.props.showLocationPrompt) {
      // ensure it get
      this.locationPrompt()
    }
  }

  render() {
    return (
      <View style={styles.contentContainer} >
        <FlatList
          data={this.props.threads}
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

  // Simple Alert based prompt to get Notification permissions
  locationPrompt() {
    // give the user a prompt
    const platform = Platform.OS === 'android' ? 'Android' : 'iOS'
    // never show it again
    this.props.completeBackgroundLocation()
    Alert.alert(
      'Location',
      `Textile can find content shared to you more quickly by having ${platform} wake it up when you change locations. This data is never collected or stored.`,
      [
        {
          text: 'Okay',
          onPress: () => {
            // never show it again
            this.props.enableLocation()
          }
        },
        { text: 'Not now',
          style: 'cancel',
          onPress: () => {
            // never show it again
          }
        },
        {
          text: 'Show all options',
          onPress: () => {
            // take them to settings
            this.props.navigation.navigate('Settings')
          }
        }
      ],
      { cancelable: false }
    )
  }

}

const mapStateToProps = (state: RootState): StateProps => {
  const threads = getThreadsAndMembers(state, 8)
  const memberCount = threads.reduce((prev, thread) => {
    return prev + thread.memberCount
  }, 0)
  const itemCount = threads.reduce((prev, thread) => {
    return prev + thread.size
  }, 0)

  const showNotificationsPrompt = PreferencesSelectors.showNotificationPrompt(state)
    && threads.length > 0
    && memberCount > threads.length

  const showLocationPrompt = PreferencesSelectors.showBackgroundLocationPrompt(state)
    && itemCount > 8

  return {
    threads,
    showNotificationsPrompt,
    showLocationPrompt,
    itemCount
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
    enableLocation: () => {
      dispatch(PreferencesActions.toggleServicesRequest('backgroundLocation', true))
    },
    completeNotifications: () => {
      dispatch(PreferencesActions.completeTourSuccess('notifications'))
    },
    completeBackgroundLocation: () => {
      dispatch(PreferencesActions.completeTourSuccess('location'))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Groups)
