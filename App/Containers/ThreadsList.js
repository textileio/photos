import React from 'react'
import { connect } from 'react-redux'
import { View, Text, Image, ScrollView, RefreshControl } from 'react-native'
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

  _onPressItem = (item) => {
    const { id, name } = item
    this.props.viewThread(id, name)
  }

  _onRefresh = () => {
    this.props.refreshMessages()
  }

  render () {
    return (
      <View style={styles.container}>
        {this.props.threads.length === 0 && (
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
              this.props.navigation.navigate('AddThread')
            }} />
          </View>
        )}
        {this.props.threads.length !== 0 && (
          // FIXME: This should be a FlatList for sure
          <ScrollView
            style={styles.contentContainer}
            refreshControl={
              <RefreshControl
                refreshing={this.props.refreshing}
                onRefresh={this._onRefresh}
              />
            }>
            {this.props.threads.map((item, i) => (
              <ThreadCard key={i} {...item} profile={this.props.profile} onPress={this._onPressItem}/>
            ))}
          </ScrollView>
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
      thread.updated = Date.now() // TODO: could use a thread created timestamp...
      if (nodeThread && nodeThread.items) {
        const items = nodeThread.items
        // total number of images in the thread
        thread.size = nodeThread.items.length
        // just keep the top 2
        thread.photos = items.slice(0, 3)

        // get a rough count of distinct users
        thread.userCount = thread.photos.length > 0 ? [...new Set(thread.photos.map(photo => photo.photo.author_id))].length : 1
          // latest update based on the latest item
        thread.updated = thread.photos.length > 0 && thread.photos[0].photo && thread.photos[0].photo.date ? moment(thread.photos[0].photo.date) : undefined
        // latest peer to push to the thread
        // thread.latestPeerId = thread.photos && thread.photos.length > 0 && thread.photos[0].photo && thread.photos[0].photo.author_id ? thread.photos[0].photo.author_id : undefined
        thread.latestPeerId = thread.photos.length > 0 && thread.photos[0].photo && thread.photos[0].photo.author_id ? thread.photos[0].photo.author_id : undefined
      }
      return thread
    })
    .sort((a, b) => a.updated < b.updated)

  return {
    profile,
    threads,
    refreshing: !!state.ui.refreshingMessages
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    viewThread: (threadId, threadName) => { dispatch(UIActions.viewThreadRequest(threadId, threadName)) },
    refreshMessages: (hidden) => { dispatch(UIActions.refreshMessagesRequest(hidden)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreadsList)
