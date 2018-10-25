import React from 'react'
import Icons from '../Components/Icons'
import { connect } from 'react-redux'
import HeaderButtons, { Item } from 'react-navigation-header-buttons'
import { TextileHeaderButtons } from '../Components/HeaderButtons'

import { View, Text, Image, Alert, TouchableWithoutFeedback } from 'react-native'
import ActionSheet from 'react-native-actionsheet'
import PhotoStream from '../Components/PhotoStream'
import Avatar from '../Components/Avatar'

import PhotoViewingActions from '../Redux/PhotoViewingRedux'
import PreferencesActions from '../Redux/PreferencesRedux'
import TextileNodeActions from '../Redux/TextileNodeRedux'
import UIActions from '../Redux/UIRedux'
import { defaultThreadData, getThreads } from '../Redux/PhotoViewingSelectors'

import CreateThreadModal from '../Components/CreateThreadModal'

import styles from '../SB/views/ThreadsList/statics/styles'
import onboardingStyles from './Styles/OnboardingStyle'
import navStyles from '../Navigation/Styles/NavigationStyles'

class ThreadsList extends React.PureComponent {
  state = {
    showCreateThreadModal: false
  }

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
        <Item title='Add Photo' iconName='add-photo' onPress={params.showWalletPicker} />
        <Item title='Options' iconName='more' onPress={params.showActionSheet} />
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
      toggleVerboseUi: this.props.toggleVerboseUi,
      showActionSheet: () => {
        this.showActionSheet()
      },
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
          This is your shared photo stream,
          where you can come to see the latest
          photos shared to you in any of your
          private Threads or post a new photo.
        </Text>
        <Text style={onboardingStyles.emptyStateText}>
          Click the <Icons name='more' size={28} color='black' /> button above and create your first Thread.
        </Text>
      </View>
    )
  }

  cancelCreateThread () {
    return () => {
      this.setState({showCreateThreadModal: false})
    }
  }

  completeCreateThread () {
    return () => {
      this.setState({showCreateThreadModal: false})
    }
  }

  showActionSheet () {
    this.actionSheet.show()
  }

  handleActionSheetResponse (index) {
    if (index === 0) {
      if (this.props.showOnboarding === true) {
        this.props.completeScreen('threads')
      }
      this.setState({showCreateThreadModal: true})
    } else if (index === 1) {
      this.props.navigation.navigate('ThreadsManager')
    }
  }

  render () {
    return (
      <View style={styles.container}>
        {this.props.showOnboarding && this._renderOnboarding()}
        {!this.props.showOnboarding && <PhotoStream displayThread items={this.props.items} />}

        <ActionSheet
          ref={o => { this.actionSheet = o }}
          title={'Threads'}
          options={['Create Thread', 'Manage Threads', 'Cancel']}
          cancelButtonIndex={2}
          onPress={this.handleActionSheetResponse.bind(this)}
        />

        <CreateThreadModal
          isVisible={this.state.showCreateThreadModal}
          fullScreen={false}
          selectToShare={false}
          navigateTo={true}
          cancel={this.cancelCreateThread()}
          complete={this.completeCreateThread()}
        />

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
  }

  const items = Object.keys(state.photoViewing.threads)
    .filter((id) => state.photoViewing.threads[id].name !== 'default')
    .map((id) => state.photoViewing.threads[id].photos
      .map((photo) => {
        return { type: 'photo', photo, id: photo.id, threadId: id, threadName: state.photoViewing.threads[id].name }
      })
    )
    .reduce((accumulator, currentValue) => accumulator.concat(currentValue), [])
    .sort((a, b) => new Date(b.photo.date) - new Date(a.photo.date))

  const defaultData = defaultThreadData(state)
  const defaultThreadId = defaultData ? defaultData.id : undefined

  const processingItems = state.processingImages.images
    .filter(image => image.destinationThreadId && image.destinationThreadId !== defaultThreadId)
    .map(image => {
      let progress = 0
      if (image.shareToThreadData) {
        progress = 1
      } else if (image.addToWalletData) {
        progress = 0.95
      } else if (image.uploadData) {
        progress = 0.1 + (image.uploadData.uploadProgress * 0.8)
      } else if (image.addData) {
        progress = 0.1
      }
      const message = image.state
      return {
        id: image.uuid,
        type: 'processingItem',
        props: {
          imageUri: image.sharedImage.origURL || image.sharedImage.uri, // TODO: Check this on Android
          progress,
          message,
          errorMessage: image.error
        }
      }
    })

  // add processing items to the beginning of the list
  items.unshift(...processingItems)

  return {
    profile,
    items,
    showNotificationsPrompt: state.preferences.tourScreens.notifications && threads,
    services: state.preferences.services,
    showOnboarding: state.preferences.tourScreens.threads && threads && threads.length === 0
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    completeScreen: (name) => { dispatch(PreferencesActions.completeTourSuccess(name)) },
    enableNotifications: () => { dispatch(PreferencesActions.toggleServicesRequest('notifications', true)) },
    refreshMessages: () => { dispatch(TextileNodeActions.refreshMessagesRequest()) },
    showWalletPicker: () => { dispatch(UIActions.showWalletPicker()) },
    toggleVerboseUi: () => { dispatch(PreferencesActions.toggleVerboseUi()) },
    toggleThreadsLayout: () => { dispatch(PreferencesActions.toggleThreadsLayout()) },
    viewThread: (threadId) => { dispatch(PhotoViewingActions.viewThread(threadId)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreadsList)
