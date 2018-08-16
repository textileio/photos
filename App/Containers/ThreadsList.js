import React from 'react'
import { connect } from 'react-redux'
import { View, Text, Image, ScrollView, RefreshControl, FlatList } from 'react-native'
import HeaderButtons, { Item } from 'react-navigation-header-buttons'
import moment from 'moment'

import { TextileHeaderButtons, Item as TextileItem } from '../Components/HeaderButtons'

import Button from '../SB/components/Button'
import ThreadCard from '../SB/components/ThreadListCard'

import Avatar from '../Components/Avatar'
import ContactsActions from '../Redux/ContactsRedux'

import styles from '../SB/views/ThreadsList/statics/styles'
import navStyles from '../Navigation/Styles/NavigationStyles'
import Colors from '../Themes/Colors'
import TextileNodeActions from '../Redux/TextileNodeRedux'
import UIActions from '../Redux/UIRedux'
import PreferencesActions from '../Redux/PreferencesRedux'

class ThreadsList extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    const avatarUrl = params.profile && params.profile.avatar_id ? 'https://cafe.us-east-1.textile.io' + params.profile.avatar_id : undefined
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
    const headerRight = (
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
    this.props.refreshMessages(true)
  }

  componentDidMount () {
    this.props.navigation.setParams({
      profile: this.props.profile
    })
  }

  componentDidUpdate (prevProps, prevState, ss) {
    if (
      this.props.profile !== prevProps.profile
    ) {
      this.props.navigation.setParams({
        profile: this.props.profile
      })
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

  render () {
    return (
      <View style={styles.container}>
        {(!this.props.hideTourScreen && this.props.threads.length === 0) && (
          <View style={styles.emptyStateContainer}>
            <Image
              style={styles.emptyStateImage}
              source={require('../SB/views/ThreadsList/statics/thread-empty-state.png')}/>
            <Text style={styles.emptyStateText}>
              This is where you can create shared
              Threads. Invite only groups to share
              photos with your friends and family.
            </Text>
            <Button primary text='Create a thread' onPress={() => {
              this.props.completeTourScreen()
              this.props.navigation.navigate('AddThread')
            }} />
          </View>
        )}
        {this.props.threads.length !== 0 && (
          // FIXME: This should be a FlatList for sure
          <View style={styles.contentContainer} >
            <FlatList
              data={this.props.threads}
              keyExtractor={this._keyExtractor}
              renderItem={this._renderItem}
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
    hideTourScreen: !state.preferences.tourScreens.threads // <- default off so users don't see a screen flash
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    viewThread: (threadId, threadName) => { dispatch(UIActions.viewThreadRequest(threadId, threadName)) },
    refreshMessages: (hidden) => { dispatch(UIActions.refreshMessagesRequest(hidden)) },
    completeTourScreen: () => { dispatch(PreferencesActions.completeTourSuccess('threads')) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreadsList)
