import React from 'react'
import Icon from '../Components/Icon'
import { connect } from 'react-redux'
import { Item } from 'react-navigation-header-buttons'
import ActionSheet from 'react-native-actionsheet'
import { TextileHeaderButtons } from '../Components/HeaderButtons'

import { View, Text, Image, Alert, Dimensions, TouchableOpacity } from 'react-native'
import PhotoStream from '../Components/PhotoStream'
import InviteContactModal from '../Components/InviteContactModal'
import Avatar from '../Components/Avatar'

import PhotoViewingActions from '../Redux/PhotoViewingRedux'
import PreferencesActions from '../Redux/PreferencesRedux'
import TextileNodeActions from '../Redux/TextileNodeRedux'
import UIActions from '../Redux/UIRedux'
import { getPhotoFeed, threadDataByThreadId } from '../Redux/PhotoViewingSelectors'
import { getProcessingImages } from '../Redux/ProcessingImagesSelectors'

import styles from '../SB/views/ThreadsList/statics/styles'
import onboardingStyles from './Styles/OnboardingStyle'

class ThreadsList extends React.PureComponent {
  state = {
    showCreateGroupModal: false,
    showInviteContactModal: false
  }

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    const showWalletPicker = () => params.showWalletPicker(params.threadId)
    const headerLeft = (
      <TextileHeaderButtons left>
        {params.threadId &&
          <Item title='Back' iconName='arrow-left' onPress={() => navigation.goBack()} />
        }
        {!params.threadId &&
          <Item
            title='Account'
            onPress={params.openDrawer}
            ButtonElement={<Avatar style={{ width: 24, height: 24 }} self={true} />}
            buttonWrapperStyle={{ margin: 11 }}
          />
        }
      </TextileHeaderButtons>
    )
    const headerRight = (
      <TextileHeaderButtons>
        <Item title='Add Photo' iconName='plus' onPress={showWalletPicker} />
        {!params.threadId && <Item title='Invite Contact' iconName='invite' onPress={params.inviteContactRequest} />}
        {params.threadId && <Item title='More' iconName='more-vertical' onPress={params.showActionSheet} />}
      </TextileHeaderButtons>
    )
    return {
      headerLeft,
      headerTitle: params.title,
      headerRight
    }
  }

  componentWillMount () {
    // refresh our messages
    this.props.refreshMessages()
  }

  componentDidMount () {
    this.props.navigation.setParams({
      title: this.props.title,
      threadId: this.props.threadId,
      profile: this.props.profile,
      online: this.props.online,
      inviteContactRequest: this.inviteContactRequest,
      showWalletPicker: this.props.showWalletPicker,
      showActionSheet: this.showActionSheet,
      openDrawer: this.openDrawer
    })
  }

  componentDidUpdate (prevProps, prevState, ss) {
    if (
      this.props.profile !== prevProps.profile ||
      this.props.online !== prevProps.online
    ) {
      this.props.navigation.setParams({
        profile: this.props.profile,
        online: this.props.online
      })
    }
    // After user is in system and has some photos, prompted them about enabling Notifications
    if (
      this.props.items &&
      prevProps.items &&
      this.props.showNotificationsPrompt &&
      !this.props.showOnboarding &&
      this.props.items.length !== prevProps.items.length
    ) {
      this._notificationPrompt()
    }
    // Auto complete the tour screen if the user has managed to create threads on their own
    if (
      this.props.items.length &&
      this.props.showOnboarding
    ) {
      this.props.completeScreen('threads')
    }
  }

  _notificationPrompt () {
    // never show it again
    this.props.completeScreen('notifications')
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

  _renderOnboarding () {
    // needed a dynamic width for the blurb to fit without scroll
    const containerWidth = (Dimensions.get('window').width) * 0.92
    const fontSize = Math.min(containerWidth / (32 * 0.5476) - 5, 16)
    return (
      <View style={onboardingStyles.emptyStateContainer}>
        <Image
          style={onboardingStyles.emptyStateImage}
          source={require('../Images/v2/thread-empty-state.png')} />
        <Text style={{...onboardingStyles.emptyStateText, fontSize}}>
          This is your private update stream,
          where you can come to see the latest
          photos shared to you in any of your
          private Groups or post a new photo.
        </Text>
        <Text style={{...onboardingStyles.emptyStateText, fontSize}}>
          Click the <Icon name='plus' size={fontSize + 4} color='black' /> button above to start sharing photos
          or the <Icon name='invite' size={fontSize + 4} color='black' /> button to invite friends.
        </Text>
      </View>
    )
  }

  cancelInviteContact () {
    return () => {
      this.setState({showInviteContactModal: false})
    }
  }

  inviteContactRequest = () => {
    this.setState({showInviteContactModal: true})
  }

  showActionSheet = () => {
    this.actionSheet.show()
  }

  handleActionSheetResponse = (index) => {
    if (index === 0) {
      this.inviteContactRequest()
    } else if (index === 1) {
      this.props.leaveThread(this.props.threadId)
    }
  }

  openDrawer = () => {
    this.props.navigation.openDrawer()
  }

  render () {
    const displayThread = this.props.threadId ? false : true
    return (
      <View style={styles.container}>
        {this.props.showOnboarding && this._renderOnboarding()}
        {!this.props.showOnboarding && <PhotoStream displayThread={displayThread} items={this.props.items}/>}
        <InviteContactModal
          isVisible={this.state.showInviteContactModal}
          cancel={this.cancelInviteContact()}
          selectedThreadId={this.props.threadId}
          selectedThreadName={this.props.title}
        />
        <ActionSheet
          ref={o => { this.actionSheet = o }}
          title={this.props.title + ' options'}
          options={['Invite Others', 'Leave Group', 'Cancel']}
          cancelButtonIndex={2}
          onPress={this.handleActionSheetResponse}
        />
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const profile = state.preferences.profile

  const threadId = ownProps.navigation.getParam('threadId', undefined)

  let title = 'Timeline'
  if (threadId) {
    const threadData = threadDataByThreadId(state, threadId)
    title = threadData ? threadData.name : 'No Name Group'
  }

  const items = getPhotoFeed(state, threadId)
  const processingItems = getProcessingImages(state, threadId)

  // add processing items to the beginning of the list
  items.unshift(...processingItems)

  // Only display thread joins if we're not viewing a specific thread
  if (!threadId) {
    const threadJoins = state.threads.inboundInvites
    .filter((invite) => !invite.dismiss)
    .map((invite) => {
      return {
        props: invite,
        type: 'processingThread'
      }
    })
    items.unshift(...threadJoins)
  }

  return {
    title,
    threadId,
    profile,
    items,
    showNotificationsPrompt: state.preferences.tourScreens.notifications && items.length,
    services: state.preferences.services,
    showOnboarding: state.preferences.tourScreens.threads && items && items.length === 0
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    completeScreen: (name) => { dispatch(PreferencesActions.completeTourSuccess(name)) },
    enableNotifications: () => { dispatch(PreferencesActions.toggleServicesRequest('notifications', true)) },
    refreshMessages: () => { dispatch(TextileNodeActions.refreshMessagesRequest()) },
    showWalletPicker: (threadId) => { dispatch(UIActions.showWalletPicker(threadId)) },
    viewThread: (threadId) => { dispatch(PhotoViewingActions.viewThread(threadId)) },
    leaveThread: (threadId) => { dispatch(PhotoViewingActions.removeThreadRequest(threadId)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreadsList)
