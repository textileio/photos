import React from 'react'
import Icons from '../Components/Icons'
import { connect } from 'react-redux'
import { View, Text, Image, Alert, TouchableWithoutFeedback } from 'react-native'
import HeaderButtons, { Item } from 'react-navigation-header-buttons'

import { TextileHeaderButtons } from '../Components/HeaderButtons'

import ThreadSelector from '../Components/ThreadSelector'

import Avatar from '../Components/Avatar'

import styles from '../SB/views/ThreadsList/statics/styles'
import onboardingStyles from './Styles/OnboardingStyle'
import navStyles from '../Navigation/Styles/NavigationStyles'
import PhotoViewingActions from '../Redux/PhotoViewingRedux'
import PreferencesActions from '../Redux/PreferencesRedux'
import TextileNodeActions from '../Redux/TextileNodeRedux'
import { getThreads } from '../Redux/PhotoViewingSelectors'

class ThreadsList extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    const username = params.profile && params.profile.username ? params.profile.username : undefined
    const headerLeft = (
      <HeaderButtons left>
        <Item
          title='Account'
          onPress={() => navigation.navigate('Account', { username })}
          buttonWrapperStyle={{ marginLeft: 11, marginRight: 11 }}
          ButtonElement={
            <Avatar
              width={24}
              height={24}
              defaultSource={require('../SB/views/Notifications/statics/main-image.png')}
              owner
            />
          }
        />
      </HeaderButtons>
    )
    const headerRight = (
      <TextileHeaderButtons>
        <Item title='Add Thread' iconName='add-thread' onPress={() => {
          if (params.onTour) {
            // We don't want to show that tour screen to them ever again...
            params.completeTour()
          }
          navigation.navigate('AddThread')
        }} />
      </TextileHeaderButtons>
    )
    const headerTitle = (
      <View style={navStyles.headerTitleLogo}>
        <TouchableWithoutFeedback
          delayLongPress={3000}
          onLongPress={params.toggleVerboseUi}>
          <Image style={navStyles.headerLogo} source={require('../SB/views/ThreadsList/statics/logo.png')} />
        </TouchableWithoutFeedback>
      </View>
    )
    return {
      headerLeft,
      headerTitle,
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
      onTour: this.props.showOnboarding === true,
      toggleVerboseUi: this.props.toggleVerboseUi,
      completeTour: () => {
        this.props.completeScreen('threads')
      }
    })
  }

  componentDidUpdate (prevProps, prevState, ss) {
    if (
      this.props.profile !== prevProps.profile ||
      this.props.showOnboarding !== prevProps.showOnboarding ||
      this.props.online !== prevProps.online
    ) {
      this.props.navigation.setParams({
        profile: this.props.profile,
        online: this.props.online,
        onTour: this.props.showOnboarding === true
      })
    }
    if (
      this.props.threads &&
      prevProps.threads &&
      this.props.showNotificationsPrompt &&
      !this.props.showOnboarding &&
      this.props.threads.length !== prevProps.threads.length
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
          This is where you can view and create
          new shared Threads - invite
          only groups to privately share photos
          with your friends and family..
        </Text>
        <Text style={onboardingStyles.emptyStateText}>
          Click the <Icons name='add-thread' size={24} color='black' /> button above to create your first Thread.
        </Text>
      </View>
    )
  }

  render () {
    return (
      <View style={styles.container}>
        {this.props.showOnboarding && this._renderOnboarding()}
        {!this.props.showOnboarding && <ThreadSelector threads={this.props.threads} proflie={this.props.profile} />}
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  const profile = state.preferences.profile
  const allThreads = getThreads(state)
  let threads
  if (allThreads.length > 0) {
    threads = allThreads
      .filter(thread => thread.name !== 'default')
      .map(thread => {
        return {
          id: thread.id,
          name: thread.name,
          // total number of images in the thread
          size: thread.photos.length,
          // just keep the top 2
          photos: thread.photos.slice(0, 3),
          // get a rough count of distinct users
          userCount: thread.photos.length > 0 ? [...new Set(thread.photos.map(photo => photo.author_id))].length : 1,
          // latest update based on the latest item
          updated: thread.photos.length > 0 && thread.photos[0].date ? Date.parse(thread.photos[0].date) : 0,
          // latest peer to push to the thread
          latestPeerId: thread.photos.length > 0 && thread.photos[0].author_id ? thread.photos[0].author_id : undefined
        }
      })
      .sort((a, b) => a.updated < b.updated)
  }

  return {
    profile,
    threads,
    showNotificationsPrompt: state.preferences.tourScreens.notifications && threads,
    services: state.preferences.services,
    showOnboarding: state.preferences.tourScreens.threads && threads && threads.length === 0
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    viewThread: (threadId) => { dispatch(PhotoViewingActions.viewThread(threadId)) },
    refreshMessages: () => { dispatch(TextileNodeActions.refreshMessagesRequest()) },
    completeScreen: (name) => { dispatch(PreferencesActions.completeTourSuccess(name)) },
    enableNotifications: () => { dispatch(PreferencesActions.toggleServicesRequest('notifications', true)) },
    toggleVerboseUi: () => { dispatch(PreferencesActions.toggleVerboseUi()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreadsList)
