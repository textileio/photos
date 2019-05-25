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

interface NavProps {
  openDrawer: () => void
}

interface ComponentState {
  willFocus?: NavigationEventSubscription
  willBlur?: NavigationEventSubscription
}

type Props = StateProps & DispatchProps & NavigationScreenProps<NavProps>

class Notifications extends React.PureComponent<Props> {
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
  state: ComponentState = {}

  // gets called every time the user enters this tab
  _onFocus = () => {
    // refresh the messages for the user
    this.props.refreshNotifications() // < will get called on the very first entry too
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
          This is your notification feed where you'll be able to quickly view
          all activity in your groups, such as likes, comments, and new photo
          shares. There's nothing here yet, so go invite some friends!
        </Text>
      </View>
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
        />
      </View>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.props.showOnboarding && this._renderOnboarding()}
        {!this.props.showOnboarding && this._renderItems()}
      </View>
    )
  }
}

interface StateProps {
  notifications: Notification[]
  showOnboarding: boolean
}

const mapStateToProps = (state: RootState): StateProps => {
  const notifications = NotificationsSelectors.latestAndUnreadFirst(state)
  const showOnboarding = state.preferences.tourScreens.feed === true

  return {
    notifications,
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
