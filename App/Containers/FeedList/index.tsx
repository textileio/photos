import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import {
  View,
  Text,
  FlatList,
  Image,
  Dimensions,
  ListRenderItemInfo
} from 'react-native'
import {
  NavigationScreenProps,
  NavigationEventSubscription
} from 'react-navigation'
import Buttons from 'react-navigation-header-buttons'

import Avatar from '../../Components/Avatar'
import FeedItem from '../../SB/components/FeedItem'
import { TextileHeaderButtons } from '../../Components/HeaderButtons'

import PreferencesActions from '../../Redux/PreferencesRedux'
import TextileEventsActions from '../../Redux/TextileEventsRedux'
import NotificationsActions, {
  NotificationsSelectors
} from '../../Redux/NotificationsRedux'
import { RootAction, RootState } from '../../Redux/Types'

import { Notification } from '../../Models/Notifications'

import styles from './statics/styles'
import onboardingStyles from '../Styles/OnboardingStyle'
import AlertRow from '../../SB/components/AlertRow'

interface NavProps {
  openDrawer: () => void
}

type Props = StateProps & DispatchProps & NavigationScreenProps<NavProps>

interface State {
  willFocus?: NavigationEventSubscription
  willBlur?: NavigationEventSubscription
  focusRefreshInProgress: boolean
}

class Notifications extends React.Component<Props, State> {
  static navigationOptions = ({
    navigation
  }: NavigationScreenProps<NavProps>) => {
    const openDrawer = navigation.getParam('openDrawer')

    const headerTitle = 'Notifications'

    const headerLeft = (
      <TextileHeaderButtons left={true}>
        <Buttons.Item
          title="Account"
          onPress={openDrawer}
          ButtonElement={
            <Avatar style={{ width: 24, height: 24 }} self={true} />
          }
          buttonWrapperStyle={{ margin: 11 }}
        />
      </TextileHeaderButtons>
    )

    return {
      headerTitle,
      headerLeft,
      headerRight: <View /> // ensure spacing in android
    }
  }

  constructor(props: Props) {
    super(props)
    // A focus refresh starts on the first entry, so focusRefresInProgress starts off true
    this.state = {
      focusRefreshInProgress: true
    }
  }

  // gets called every time the user enters this tab
  _onFocus = () => {
    // refresh the messages for the user
    this.props.refreshNotifications() // < will get called on the very first entry too
    // Update the state to reflect that an initial refresh (a refresh on focus) is in progress
    this.setState({
      focusRefreshInProgress: true
    })
  }

  // gets called every time the user exists the tab
  _onBlur = () => {
    // if the user was on the page long enough, we'll just clear all unread
    this.props.readAllNotifications()
  }

  componentDidMount() {
    // on mount, set listeners for enter and exit of the tab
    const willFocus = this.props.navigation.addListener(
      'willFocus',
      this._onFocus
    )
    const willBlur = this.props.navigation.addListener('willBlur', this._onBlur)
    this.props.navigation.setParams({
      openDrawer: this.openDrawer
    })
    this.setState({
      willFocus,
      willBlur
    })
  }

  componentDidUpdate(prevProps: Props) {
    // Will clear the onboarding only after the first feed item appears
    if (
      this.props.showOnboarding &&
      this.props.notifications !== prevProps.notifications &&
      this.props.notifications.length > 0
    ) {
      this.props.completeTourScreen()
    }
    // If the component state indicates that a focus refresh is in progress and the redux state
    // indicates that the notifications are not refreshing, then the focus refresh must have
    // completed, so update the component state to reflect that.
    if (this.state.focusRefreshInProgress && !this.props.refreshing) {
      this.setState({
        focusRefreshInProgress: false
      })
    }
  }

  componentWillUnmount() {
    // remove the listeners for enter / exit the tab
    if (this.state.willFocus) {
      this.state.willFocus.remove()
    }
    if (this.state.willBlur) {
      this.state.willBlur.remove()
    }
  }

  _onClick = (notification: Notification) => {
    this.props.clickNotification(notification)
  }

  _keyExtractor = (item: Notification, index: number) => item.id + '_' + index

  openDrawer = () => {
    this.props.navigation.openDrawer()
  }

  registerCafe = () => {
    this.props.navigation.navigate('RegisterCafe')
  }
  _renderItem = ({ item }: ListRenderItemInfo<Notification>) => {
    return <FeedItem notification={item} onClick={this._onClick} />
  }

  _renderOnboarding() {
    // needed a dynamic width for the blurb to fit without scroll
    const containerWidth = Dimensions.get('window').width * 0.92
    const fontSize = Math.min(containerWidth / (32 * 0.5476) - 5, 16)
    return (
      <View style={onboardingStyles.emptyStateContainer}>
        <Image
          style={onboardingStyles.emptyStateImage3}
          source={require('../../Images/v2/notifications.png')}
        />
        <Text style={[onboardingStyles.emptyStateText, { fontSize }]}>
          This is your notification feed where you&apos;ll be able to quickly
          view all activity in your groups, such as likes, comments, and new
          photo shares. There&apos;s nothing here yet, so go invite some
          friends!
        </Text>
      </View>
    )
  }

  _renderAlert() {
    if (!this.props.alert) {
      return
    }

    return (
      <AlertRow
        message={this.props.alert}
        onClick={this.registerCafe}
      />
    )
  }
  _renderItems() {
    return (
      <View style={styles.contentContainer}>
        <FlatList
          data={this.props.notifications}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          refreshing={false}
          onRefresh={this.props.refreshMessages}
          initialNumToRender={20}
          ListHeaderComponent={this._renderAlert()}
        />
      </View>
    )
  }

  render() {
    // Never show the art during an initial refresh (a refresh on focus), only show it once
    // the initial refresh has completed and returned 0 results. This is to avoid the art
    // flickering for a second and then disappearing, which is ugly.
    const showNotifications =
      this.state.focusRefreshInProgress || this.props.notifications.length > 0 || this.props.alert
    return (
      <View style={styles.container}>
        {!showNotifications && this._renderOnboarding()}
        {showNotifications && this._renderItems()}
      </View>
    )
  }
}

interface StateProps {
  alert?: string
  notifications: Notification[]
  refreshing: boolean
  showOnboarding: boolean
}

const mapStateToProps = (state: RootState): StateProps => {
  const notifications = NotificationsSelectors.latestAndUnreadFirst(state)
  const showOnboarding = state.preferences.tourScreens.feed === true
  const refreshing = state.notifications.refreshing

  const alert = Object.keys(state.cafes.cafes).length > 0 ? undefined : 'Improve app performance by choosing an account cafe now.'

  return {
    alert,
    notifications,
    refreshing,
    showOnboarding
  }
}

interface DispatchProps {
  refreshNotifications: () => void
  readAllNotifications: () => void
  refreshMessages: () => void
  clickNotification: (notification: Notification) => void
  completeTourScreen: () => void
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => ({
  refreshNotifications: () =>
    dispatch(NotificationsActions.refreshNotificationsRequest()),
  readAllNotifications: () =>
    dispatch(NotificationsActions.readAllNotificationsRequest()),
  refreshMessages: () => {
    dispatch(TextileEventsActions.refreshMessagesRequest())
  },
  clickNotification: notification =>
    dispatch(NotificationsActions.notificationSuccess(notification)),
  completeTourScreen: () => {
    dispatch(PreferencesActions.completeTourSuccess('feed'))
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Notifications)
