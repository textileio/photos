import React from 'react'
import { connect } from 'react-redux'
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'
import moment from 'moment'

import Button from '../SB/components/Button'
import ThreadCard from '../SB/components/ThreadListCard'

import Avatar from '../Components/Avatar'

import styles from '../SB/views/ThreadsList/statics/styles'
import navStyles from '../Navigation/Styles/NavigationStyles'
import Colors from '../Themes/Colors'

class MyListItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPressItem(this.props.item)
  }

  render () {
    return (
      <TouchableOpacity onPress={this._onPress}>
        <View style={styles.listItem}>
          <Text style={styles.listItemText}>
            {this.props.item.name}
          </Text>
          <Icon name={'ios-arrow-forward'} size={30} color={Colors.steel} />
        </View>
      </TouchableOpacity>
    )
  }
}

class ThreadsList extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      empty: true,
      selected: (new Map(): Map<string, boolean>)
    }
  }

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}

    const avatarUrl = params.profile && params.profile.avatar_id ? 'https://cafe.us-east-1.textile.io' + params.profile.avatar_id : undefined
    const username = params.profile && params.profile.username ? params.profile.username : undefined

    const headerLeft = (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Account', {avatarUrl, username})
        }}
      >
        <Avatar width={24} height={24} uri={avatarUrl} defaultSource={require('../SB/views/Settings/statics/main-image.png')} />
        {/*<Image style={navStyles.headerIcon} source={require('../SB/views/ThreadsList/statics/photo.png')} />*/}
      </TouchableOpacity>
    )
    const headerRight = (
      <TouchableOpacity style={navStyles.moreButtonWrapper} onPress={() => { navigation.navigate('AddThread') }}>
        <Image style={navStyles.headerIcon} source={require('../SB/views/ThreadsList/statics/plus.png')} />
      </TouchableOpacity>
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

  componentDidMount () {
    this.props.navigation.setParams({
      profile: this.props.profile
    })
  }

  _keyExtractor = (item, index) => item.id

  _onPressItem = (item) => {
    const { id, name } = item
    this.props.navigation.navigate('ViewThread', { id: id, name: name })
  }

  _renderItem = ({item}) => (
    <MyListItem
      item={item}
      onPressItem={this._onPressItem}
      selected={!!this.state.selected.get(item.id)}
    />
  )

  _onSubmit = () => {
    this.props.navigation.navigate('Comment')
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
              Start sharing your memories with
              friends and family with threads.
            </Text>
            <Button primary text='Create new thread' onPress={() => {
              this.props.navigation.navigate('AddThread')
            }} />
          </View>
        )}
        {this.props.threads.length !== 0 && (
          <ScrollView style={styles.contentContainer}>
            {this.props.threads.map((item, i) => (
              <ThreadCard key={i} {...item} onPress={this._onPressItem}/>
            ))}
          </ScrollView>
        )}
      </View>
    )
  }
}


const mapStateToProps = (state) => {
  const threads = state.threads.threads
    .filter(thread => thread.name !== 'default')
    .map(thread => {
      const nodeThread = state.textileNode.threads[thread.id]
      // Todo: we'll want to get all this from a better source
      if (nodeThread && nodeThread.items) {
        const items = nodeThread.items
        // total number of images in the thread
        thread.size = nodeThread.items.length
        // just keep the top 2
        thread.photos = items.slice(0, 3)

        // get a rough count of distinct users
        thread.userCount = thread.photos && thread.photos.length > 0 ? [...new Set(thread.photos.map(photo => photo.metadata.peer_id))].length : 1
          // latest update based on the latest item
        thread.updated = thread.photos && thread.photos.length > 0 && thread.photos[0].photo && thread.photos[0].photo.date ? moment(thread.photos[0].photo.date) : undefined
        // latest peer to push to the thread
        thread.latestPeerId = thread.photos && thread.photos.length > 0 && thread.photos[0].metadata && thread.photos[0].metadata.peer_id ? thread.photos[0].metadata.peer_id : undefined
      }
      return thread
    })
    .sort((a, b) => a.updated < b.updated)

  return {
    profile: state.preferences.profile,
    threads
  }
}

const mapDispatchToProps = (dispatch) => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreadsList)
