import React from 'react'
import { connect } from 'react-redux'
import { View, Text, Image, FlatList, Alert } from 'react-native'
import Config from 'react-native-config'
import HeaderButtons, { Item } from 'react-navigation-header-buttons'

import { TextileHeaderButtons } from '../Components/HeaderButtons'

import Button from '../SB/components/Button'
import ThreadCard from '../SB/components/ThreadListCard'

import Avatar from '../Components/Avatar'

import styles from '../SB/views/ThreadsList/statics/styles'
import navStyles from '../Navigation/Styles/NavigationStyles'
import UIActions from '../Redux/UIRedux'
import PreferencesActions from '../Redux/PreferencesRedux'
import TextileNodeActions from '../Redux/TextileNodeRedux'

class ThreadsList extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    const avatarUrl = params.profile && params.profile.avatar_id ? Config.TEXTILE_CAFE_URI + params.profile.avatar_id : undefined
    const username = params.profile && params.profile.username ? params.profile.username : undefined
    const headerLeft = (
      <HeaderButtons left>
        <Item
          title='Account'
          delayLongPress={3000}
          onLongPress={params.toggleVerboseUi}
          onPress={() => navigation.navigate('Account', {avatarUrl, username})}
          buttonWrapperStyle={{marginLeft: 11, marginRight: 11}}
          ButtonElement={
            <Avatar
              width={24}
              height={24}
              uri={avatarUrl}
              defaultSource={require('../SB/views/Settings/statics/main-image.png')}
            />
          }
        />
      </HeaderButtons>
    )
    const headerRight = params.onTour ? undefined : (
      <TextileHeaderButtons>
        <Item title='Add Thread' iconName='add-thread' onPress={() => { navigation.navigate('AddThread') }} />
      </TextileHeaderButtons>
    )
    const headerTitle = (
      <Image style={navStyles.headerLogo} source={require('../SB/views/ThreadsList/statics/logo.png')} />
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
      onTour: this.props.tourScreen === true
    })
  }

  componentDidUpdate (prevProps, prevState, ss) {
    if (
      this.props.profile !== prevProps.profile ||
      this.props.tourScreen !== prevProps.tourScreen
    ) {
      this.props.navigation.setParams({
        profile: this.props.profile,
        onTour: this.props.tourScreen === true
      })
    }
    if (
      this.props.threads.length !== prevProps.threads.length
    ) {
      this._notificationPrompt()
    }
  }

  _notificationPrompt () {
    if (this.props.notificationsPrompt && !this.props.tourScreen && this.props.threads.length > 0) {
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
          {text: 'Not now', style: 'cancel'},
          {
            text: 'Show all options',
            onPress: () => {
              this.props.navigation.navigate('Settings')
            }
          }
        ],
        {cancelable: false}
      )
    }
  }

  _onPressItem = (photo) => {
    const { id, name } = photo
    this.props.viewThread(id, name)
  }

  _onRefresh = () => {
    this.props.refreshMessages()
  }

  _keyExtractor = (item, index) => item.id

  _renderItem = ({item}) => {
    return (
      <ThreadCard id={item.id} {...item} profile={this.props.profile} onPress={this._onPressItem} />
    )
  }

  _renderTour () {
    if (this.props.tourScreen === true) {
      return (
        <View style={styles.emptyStateContainer}>
          <Image
            style={styles.emptyStateImage}
            source={require('../SB/views/ThreadsList/statics/thread-empty-state.png')} />
          <Text style={styles.emptyStateText}>
            This is where you can create shared
            Threads. Invite only groups to share
            photos with your friends and family.
          </Text>
          <Button primary text='Create a thread' onPress={() => {
            this.props.completeScreen('threads')
            this.props.navigation.navigate('AddThread')
          }} />
        </View>
      )
    }
    return null
  }

  render () {
    return (
      <View style={styles.container}>
        {this._renderTour()}
        {this.props.threads.length !== 0 && (
          // FIXME: This should be a FlatList for sure
          <View style={styles.contentContainer} >
            <FlatList
              data={this.props.threads}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
              refreshing={this.props.refreshing}
              onRefresh={this._onRefresh}
            />
          </View>
        )}
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  const profile = state.preferences.profile
  const threads = state.threads.threads
    .filter(thread => thread.name !== 'default')
    .map(thread => {
      const nodeThread = state.textileNode.threads[thread.id]
      // Todo: we'll want to get all this from a better source
      thread.photos = []
      thread.updated = 0 // TODO: could use a thread created timestamp...
      if (nodeThread && nodeThread.photos) {
        const photos = nodeThread.photos
        // total number of images in the thread
        thread.size = nodeThread.photos.length
        // just keep the top 2
        thread.photos = photos.slice(0, 3)

        // get a rough count of distinct users
        thread.userCount = thread.photos.length > 0 ? [...new Set(thread.photos.map(photo => photo.author_id))].length : 1
          // latest update based on the latest item
        thread.updated = thread.photos.length > 0 && thread.photos[0].date ? Date.parse(thread.photos[0].date) : 0
        // latest peer to push to the thread
        thread.latestPeerId = thread.photos.length > 0 && thread.photos[0].author_id ? thread.photos[0].author_id : undefined
      }
      return thread
    })
    .sort((a, b) => a.updated < b.updated)

  return {
    profile,
    threads,
    refreshing: !!state.ui.refreshingMessages,
    notificationsPrompt: state.preferences.tourScreens.notifications,
    services: state.preferences.services,
    tourScreen: state.preferences.tourScreens.threads // <- default off so users don't see a screen flash
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    viewThread: (threadId, threadName) => { dispatch(UIActions.viewThreadRequest(threadId, threadName)) },
    refreshMessages: (hidden) => { dispatch(TextileNodeActions.refreshMessagesRequest(hidden)) },
    completeScreen: (name) => { dispatch(PreferencesActions.completeTourSuccess(name)) },
    enableNotifications: () => { dispatch(PreferencesActions.toggleServicesRequest('notifications', true)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreadsList)
