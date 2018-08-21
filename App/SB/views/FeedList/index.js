import React from 'react'
import { connect } from 'react-redux'
import { View, Text, FlatList, Image } from 'react-native'
import HeaderButtons, { Item } from 'react-navigation-header-buttons'
import Toast from 'react-native-easy-toast'
import Config from 'react-native-config'

import FeedItem from '../../components/FeedItem'
import Button from '../../components/Button'
import Avatar from '../../../Components/Avatar'

import * as TextileTypes from '../../../Models/TextileTypes'
import NotificationsActions from '../../../Redux/NotificationsRedux'

import styles from './statics/styles'
import navStyles from '../../../Navigation/Styles/NavigationStyles'
import PreferencesActions from '../../../Redux/PreferencesRedux'

class Notifications extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    const username = params.profile && params.profile.username ? params.profile.username : undefined
    const avatarUrl = params.profile && params.profile.avatar_id ? Config.TEXTILE_CAFE_URI + params.profile.avatar_id : undefined
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
              defaultSource={require('../../../Images/v2/main-image.png')}
            />
          }
        />
      </HeaderButtons>
    )
    const headerTitle = (
      <Text style={navStyles.headerTitle}>
        {'Feed'}
      </Text>
    )

    return {
      headerLeft,
      headerTitle
    }
  }

  componentDidMount () {
    this.props.navigation.setParams({
      profile: this.props.profile
    })
  }

  componentWillMount () {
    this.props.refreshNotifications()
  }

  _onClick (notification) {
    // TODO: get rid of this parsing once all notification types are mapped to an action in notificationView
    this.props.clickNotification(notification)
    this.refs.toast.show('Wohoo!', 250) // < for now, in case the msg doesn't forward the user anywhere
  }

  _onRefresh = () => {
    this.props.refreshNotifications()
  }

  _keyExtractor = (item, index) => item.id + '_' + index

  _renderItem = ({item}) => {
    return (
      <FeedItem profile={this.props.profile} notification={item} onClick={this._onClick.bind(this)}/>
    )
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
        {/*<FeedItemUpdate />*/}
        {this.props.showTourScreen && this._renderTour()}
        <View style={styles.contentContainer}>
          <FlatList
            data={this.props.notifications}
            keyExtractor={this._keyExtractor.bind(this)}
            renderItem={this._renderItem.bind(this)}
            refreshing={this.props.refreshing}
            onRefresh={this._onRefresh}
          />
        </View>
        <Toast ref='toast' position='center' />
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    notifications: state.notifications.notifications,
    profile: state.preferences.profile,
    refreshing: !!state.notifications.refreshing,
    showTourScreen: state.preferences.tourScreens.feed === true
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    refreshNotifications: () => dispatch(NotificationsActions.refreshNotificationsRequest()),
    clickNotification: (notification: TextileTypes.Notification) => dispatch(NotificationsActions.notificationSuccess(notification)),
    completeTourScreen: () => { dispatch(PreferencesActions.completeTourSuccess('feed')) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Notifications)
