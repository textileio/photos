import React from 'react'
import { connect } from 'react-redux'
import { View, Text, FlatList, Image, Dimensions } from 'react-native'
import { Item } from 'react-navigation-header-buttons'

import FeedItem from '../../SB/components/FeedItem'

import NotificationsActions from '../../Redux/NotificationsRedux'

import styles from './statics/styles'
import onboardingStyles from '../Styles/OnboardingStyle'
import PreferencesActions from '../../Redux/PreferencesRedux'
import TextileEventsActions from '../../Redux/TextileEventsRedux'
import { NotificationsSelectors } from '../../Redux/NotificationsRedux'
import { TextileHeaderButtons } from '../../Components/HeaderButtons'
import Avatar from '../../Components/Avatar'

class Notifications extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    const headerTitle = 'Notifications'

    const headerLeft = (
      <TextileHeaderButtons left>
        <Item
          title='Account'
          onPress={params.openDrawer}
          ButtonElement={<Avatar style={{ width: 24, height: 24 }} self={true} />}
          buttonWrapperStyle={{ margin: 11 }}
        />
      </TextileHeaderButtons>
    )

    return {
      headerTitle,
      headerLeft,
      headerRight: (<View />) // ensure spacing in android
    }
  }

  // gets called every time the user enters this tab
  _onFocus () {
    // refresh the messages for the user
    this.props.refreshNotifications() // < will get called on the very first entry too
  }

  // gets called every time the user exists the tab
  _onBlur () {
    // if the user was on the page long enough, we'll just clear all unread
    this.props.readAllNotifications()
  }

  componentDidMount () {
    // on mount, set listeners for enter and exit of the tab
    this.props.navigation.addListener('willFocus', this._onFocus.bind(this))
    this.props.navigation.addListener('willBlur', this._onBlur.bind(this))
    this.props.navigation.setParams({
      profile: this.props.profile,
      openDrawer: this.openDrawer
    })
  }

  componentDidUpdate (prevProps, prevState, snapShot) {
    // Will clear the onboarding only after the first feed item appears
    if (this.props.showOnboarding && this.props.notifications !== prevProps.notifications && this.props.notifications.length > 0) {
      this.props.completeTourScreen()
    }
  }

  componentWillUnmount () {
    // remove the listeners for enter / exit the tab
    this.props.navigation.removeListener('blur', this._onBlur.bind(this))
    this.props.navigation.removeListener('onFocus', this._onFocus.bind(this))
  }

  _onClick (notification) {
    this.props.clickNotification(notification)
  }

  _keyExtractor = (item, index) => item.id + '_' + index

  openDrawer = () => {
    this.props.navigation.openDrawer()
  }

  _renderItem = ({ item }) => {
    return (
      <FeedItem profile={this.props.profile} notification={item} onClick={this._onClick.bind(this)} />
    )
  }

  _renderOnboarding () {
    // needed a dynamic width for the blurb to fit without scroll
    const containerWidth = (Dimensions.get('window').width) * 0.92
    const fontSize = Math.min(containerWidth / (32 * 0.5476) - 5, 16)
    return (
      <View style={onboardingStyles.emptyStateContainer}>
        <Image
          style={onboardingStyles.emptyStateImage3}
          source={require('../../Images/v2/notifications.png')} />
        <Text style={{...onboardingStyles.emptyStateText, fontSize}}>
          This is your notification feed where
          you'll be able to quickly view all
          activity in your groups, such as likes,
          comments, and new photo shares. There's
          nothing here yet, so go invite some friends!
          </Text>
      </View>
    )
  }

  _renderItems () {
    return (
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
    )
  }

  render () {
    return (
      <View style={styles.container}>
        {this.props.showOnboarding && this._renderOnboarding()}
        {!this.props.showOnboarding && this._renderItems()}
        {/* <Toast ref='toast' position='top' fadeInDuration={50} style={styles.toast} textStyle={styles.toastText} /> */}
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  const notifications = NotificationsSelectors.latestAndUnreadFirst(state)
  const showOnboarding = state.preferences.tourScreens.feed === true

  return {
    notifications,
    profile: state.account.profile.value,
    showOnboarding
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    refreshNotifications: () => dispatch(NotificationsActions.refreshNotificationsRequest()),
    readAllNotifications: () => dispatch(NotificationsActions.readAllNotificationsRequest()),
    refreshMessages: () => { dispatch(TextileEventsActions.refreshMessagesRequest()) },
    clickNotification: (notification) => dispatch(NotificationsActions.notificationSuccess(notification)),
    completeTourScreen: () => { dispatch(PreferencesActions.completeTourSuccess('feed')) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications)
