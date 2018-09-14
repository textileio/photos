import React from 'react'
import { connect } from 'react-redux'
import { View, Text, FlatList, Image } from 'react-native'
import HeaderButtons, { Item } from 'react-navigation-header-buttons'
import Icons from '../../../Components/Icons'

import FeedItem from '../../components/FeedItem'
import Button from '../../components/Button'
import Avatar from '../../../Components/Avatar'

import NotificationsActions from '../../../Redux/NotificationsRedux'

import styles from './statics/styles'
import PreferencesActions from '../../../Redux/PreferencesRedux'
import TextileNodeActions from '../../../Redux/TextileNodeRedux'

class Notifications extends React.PureComponent {
  state = {
    readAllOnExit: false
  }

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    const username = params.profile && params.profile.username ? params.profile.username : undefined
    const headerLeft = (
      <HeaderButtons left>
        <Item
          title='Account'
          delayLongPress={3000}
          onLongPress={params.toggleVerboseUi}
          onPress={() => navigation.navigate('Account', { username })}
          buttonWrapperStyle={{ marginLeft: 11, marginRight: 11 }}
          ButtonElement={
            <Avatar
              width={24}
              height={24}
              defaultSource={require('../../../Images/v2/main-image.png')}
              owner
            />
          }
        />
      </HeaderButtons>
    )
    const headerTitle = 'Notifications'

    return {
      headerLeft,
      headerTitle,
      headerRight: (<View />) // ensure spacing in android
    }
  }

  // gets called every time the user enters this tab
  _onFocus () {
    // refresh the messages for the user
    this.props.refreshNotifications() // < will get called on the very first entry too
    // reset our readAll flag to re-time
    this.setState({ readAllOnExit: false })
    // set a timer to clear all unread messages
    this._setReadAllTimer()
  }

  // gets called every time the user exists the tab
  _onBlur () {
    // will be 0 if already run
    if (this.readAllHandle) {
      clearTimeout(this.readAllHandle)
      this.readAllHandle = 0
    }
    // if the user was on the page long enough, we'll just clear all unread
    if (this.state.readAllOnExit) {
      this.props.readAllNotifications()
    }
  }

  componentDidMount () {
    // on mount, set listeners for enter and exit of the tab
    this.props.navigation.addListener('willFocus', this._onFocus.bind(this))
    this.props.navigation.addListener('willBlur', this._onBlur.bind(this))
    this.props.navigation.setParams({
      profile: this.props.profile
    })
  }

  componentWillUnmount () {
    // remove the listeners for enter / exit the tab
    this.props.navigation.removeListener('blur', this._onBlur.bind(this))
    this.props.navigation.removeListener('onFocus', this._onFocus.bind(this))
  }

  _readAll () {
    this.setState({ readAllOnExit: true })
    this.readAllHandle = 0
  }
  _setReadAllTimer = () => {
    if (this.readAllHandle) return
    // After the user has been on the screen for 6 seconds, mark all as unread next time the user unmounts
    this.readAllHandle = setTimeout(this._readAll.bind(this), 6000)
  }

  _onClick (notification) {
    this.props.clickNotification(notification)
  }

  _keyExtractor = (item, index) => item.id + '_' + index

  _renderItem = ({ item }) => {
    return (
      <FeedItem profile={this.props.profile} notification={item} onClick={this._onClick.bind(this)} />
    )
  }

  _renderPlaceholder () {
    if (this.props.notifications.length === 0 && this.props.showTourScreen !== true) {
      return (
        <View style={styles.emptyStateContainer}>
          <Image
            style={styles.emptyStateImage}
            source={require('../../views/ThreadsList/statics/thread-empty-state.png')} />
          <Text style={styles.emptyStateText}>
            Nothing to see here yet... Start sharing your memories with friends and family with threads.
            Create one on the <Icons name='threads' size={16} color='black' /> tab below!
            </Text>
        </View>
      )
    }
    return null
  }

  _renderTour () {
    return (
      <View style={styles.emptyStateContainer}>
        <Image
          resizeMode={'contain'}
          style={styles.emptyStateImage}
          source={require('../../../Images/v2/invite_friends.png')} />
        <Text style={styles.emptyStateText}>
          This is where your activities and
          engagements are listed for easy
          browsing. Go share a photo!
        </Text>
        <Button primary text='Cool!' onPress={() => {
          this.props.completeTourScreen()
        }} />
      </View>
    )
  }

  render () {
    return (
      <View style={styles.container}>
        {/* <FeedItemUpdate /> */}
        {this.props.showTourScreen && this._renderTour()}
        {this._renderPlaceholder()}
        <View style={styles.contentContainer}>
          <FlatList
            data={this.props.notifications}
            keyExtractor={this._keyExtractor.bind(this)}
            renderItem={this._renderItem.bind(this)}
            refreshing={false}
            onRefresh={this.props.refreshMessages}
            initialNumToRender={20}
          />
        </View>
        {/* <Toast ref='toast' position='top' fadeInDuration={50} style={styles.toast} textStyle={styles.toastText} /> */}
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  const notifications = state.notifications.notifications
    .filter((n) => {
      if (n.type === 1) return true // a device notification
      return n.actor_username !== undefined && n.actor_username !== ''
    })
  return {
    notifications,
    profile: state.preferences.profile,
    showTourScreen: state.preferences.tourScreens.feed === true
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    refreshNotifications: () => dispatch(NotificationsActions.refreshNotificationsRequest()),
    readAllNotifications: () => dispatch(NotificationsActions.readAllNotificationsRequest()),
    refreshMessages: () => { dispatch(TextileNodeActions.refreshMessagesRequest()) },
    clickNotification: (notification) => dispatch(NotificationsActions.notificationSuccess(notification)),
    completeTourScreen: () => { dispatch(PreferencesActions.completeTourSuccess('feed')) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications)
