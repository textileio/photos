import React from 'react'
import { connect } from 'react-redux'
import { View, Text, ScrollView } from 'react-native'
import FeedItem from '../../components/FeedItem'
import Toast from 'react-native-easy-toast'

import * as TextileTypes from '../../../Models/TextileTypes'
import NotificationsActions from '../../../Redux/NotificationsRedux'

import styles from './statics/styles'

class Notifications extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: 'Notifications'
    }
  }

  componentWillMount () {
    this.props.refreshNotifications()
  }

  _onClick (notification) {
    // TODO: get rid of this parsing once all notification types are mapped to an action in notificationView
    this.refs.toast.show('Wohoo!', 500) // < for now, in case the msg doesn't forward the user anywhere
    this.props.clickNotification(notification)
  }

  render () {
    return (
      <View style={styles.container}>
        {/*<FeedItemUpdate />*/}
        <ScrollView style={styles.contentContainer}>
          {this.props.notifications.map((item, i) => (
            <FeedItem key={i} profile={this.props.profile} notification={item} onClick={this._onClick.bind(this)}/>
          ))}
        </ScrollView>
        <Toast ref='toast' position='center' />
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log(state.notifications.notifications)
  return {
    notifications: state.notifications.notifications
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    refreshNotifications: () => dispatch(NotificationsActions.refreshNotificationsRequest()),
    clickNotification: (notification: TextileTypes.Notification) => dispatch(NotificationsActions.notificationSuccess(notification))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications)
