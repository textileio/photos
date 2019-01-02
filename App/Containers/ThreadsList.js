import React from 'react'
import Icon from '../Components/Icon'
import { connect } from 'react-redux'
import { Item } from 'react-navigation-header-buttons'
import { TextileHeaderButtons } from '../Components/HeaderButtons'

import { View, Text, Image, Alert } from 'react-native'
import PhotoStream from '../Components/PhotoStream'
import InviteContactModal from '../Components/InviteContactModal'

import PhotoViewingActions from '../Redux/PhotoViewingRedux'
import PreferencesActions from '../Redux/PreferencesRedux'
import TextileNodeActions from '../Redux/TextileNodeRedux'
import UIActions from '../Redux/UIRedux'
import { getPhotoFeed } from '../Redux/PhotoViewingSelectors'
import { getProcessingImages } from '../Redux/ProcessingImagesSelectors'

import styles from '../SB/views/ThreadsList/statics/styles'
import onboardingStyles from './Styles/OnboardingStyle'

class ThreadsList extends React.PureComponent {
  state = {
    showCreateThreadModal: false,
    showInviteContactModal: false
  }

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    const username = params.profile && params.profile.username ? params.profile.username : undefined
    const headerRight = (
      <TextileHeaderButtons>
        <Item title='Add Photo' iconName='plus' onPress={params.showWalletPicker} />
        <Item title='Invite Contact' iconName='invite' onPress={params.inviteContactRequest} />
      </TextileHeaderButtons>
    )
    return {
      headerTitle: 'Timeline',
      headerRight
    }
  }

  componentWillMount () {
    // refresh our messages
    this.props.refreshMessages()
  }

  componentDidMount () {
    this.props.navigation.setParams({
      profile: this.props.profile,
      online: this.props.online,
      inviteContactRequest: this.inviteContactRequest(),
      showWalletPicker: this.props.showWalletPicker
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
    if (
      this.props.items &&
      prevProps.items &&
      this.props.showNotificationsPrompt &&
      !this.props.showOnboarding &&
      this.props.items.length !== prevProps.items.length
    ) {
      this._notificationPrompt()
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
    return (
      <View style={onboardingStyles.emptyStateContainer}>
        <Image
          style={onboardingStyles.emptyStateImage}
          source={require('../Images/v2/thread-empty-state.png')} />
        <Text style={onboardingStyles.emptyStateText}>
          This is your private update stream,
          where you can come to see the latest
          photos shared to you in any of your
          private Groups or post a new photo.
        </Text>
        <Text style={onboardingStyles.emptyStateText}>
          Click the <Icon name='plus' size={18} color='black' /> button above to start sharing photos
          or the <Icon name='invite' size={18} color='black' /> button to invite friends.
        </Text>
      </View>
    )
  }

  cancelInviteContact () {
    return () => {
      this.setState({showInviteContactModal: false})
    }
  }

  inviteContactRequest () {
    return () => {
      this.setState({showInviteContactModal: true})
    }
  }

  render () {
    return (
      <View style={styles.container}>
        {this.props.showOnboarding && this._renderOnboarding()}
        {!this.props.showOnboarding && <PhotoStream displayThread items={this.props.items}/>}

        <InviteContactModal
          isVisible={this.state.showInviteContactModal}
          cancel={this.cancelInviteContact()}
        />

      </View>
    )
  }
}

const mapStateToProps = (state) => {
  const profile = state.preferences.profile

  const items = getPhotoFeed(state)
  const processingItems = getProcessingImages(state)

  // add processing items to the beginning of the list
  items.unshift(...processingItems)

  const threadJoins = state.threads.inboundInvites
    .filter((invite) => !invite.dismiss)
    .map((invite) => {
      return {
        props: invite,
        type: 'processingThread'
      }
    })
  items.unshift(...threadJoins)

  return {
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
    showWalletPicker: () => { dispatch(UIActions.showWalletPicker()) },
    viewThread: (threadId) => { dispatch(PhotoViewingActions.viewThread(threadId)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreadsList)
