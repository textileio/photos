import React from 'react'
import {Dispatch} from 'redux'
import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux'
import { FlatList, View, Text, TouchableOpacity } from 'react-native'

import {RootAction} from '../Redux/Types'

import {ThreadData} from '../Redux/PhotoViewingRedux'
import TextileNodeActions from '../Redux/TextileNodeRedux'
import UIActions from '../Redux/UIRedux'

import ThreadCard from '../SB/components/ThreadListCard'
import styles from './Styles/ThreadSelectorStyles'

interface ScreenProps {
  threads: ReadonlyArray<ThreadData>
  createNewThread: () => void
}

class ThreadSelector extends React.Component<ScreenProps & DispatchProps & NavigationScreenProps<{}>> {

  _onPressItem = (threadCardProps: any) => {
    const { id, name } = threadCardProps
    this.props.navigateToThread(id, name)
  }

  _convertToPreview = (thread: ThreadData) => {
    return {
      id: thread.id,
      name: thread.name,
      // total number of images in the thread
      size: thread.photos.length,
      // just keep the top 2
      photos: thread.photos.slice(0, 3),
      // get a rough count of distinct users
      userCount: thread.photos.length > 0 ? [...new Set(thread.photos.map((photo) => photo.author_id))].length : 1,
      // latest update based on the latest item
      updated: thread.photos.length > 0 && thread.photos[0].date ? Date.parse(thread.photos[0].date) : 0,
      // latest peer to push to the thread
      latestPeerId: thread.photos.length > 0 && thread.photos[0].author_id ? thread.photos[0].author_id : undefined
    }
  }

  _renderItem = (rowData: any) => {
    const thread: ThreadData = rowData.item
    const item = this._convertToPreview(thread)
    return (
      <ThreadCard id={item.id} {...item} onPress={this._onPressItem} />
    )
  }

  _renderFooter = () => {
    return (
      <TouchableOpacity
        activeOpacity={0.95}
        style={styles.createThreadBox}
        onPress={this.props.createNewThread}
      >
        <Text style={styles.createThreadText}>Create New Thread</Text>
      </TouchableOpacity>
    )
  }

  _onRefresh = () => {
    this.props.refreshMessages()
  }

  _keyExtractor = (item: ThreadData) => item.id

  render () {
    return (
      <View style={styles.contentContainer} >
        <FlatList
          data={this.props.threads}
          keyExtractor={this._keyExtractor}
          renderItem={this._renderItem}
          refreshing={false}
          onRefresh={this._onRefresh}
          initialNumToRender={4}
          ListFooterComponent={this._renderFooter}
        />
      </View>
    )
  }
}

interface DispatchProps {
  refreshMessages: () => void
  navigateToThread: (id: string, name: string) => void
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => {
  return {
    refreshMessages: () => {
      dispatch(TextileNodeActions.refreshMessagesRequest())
    },
    navigateToThread: (id: string, name: string) => {
      dispatch(UIActions.navigateToThreadRequest(id, name))
    }
  }
}

export default connect(undefined, mapDispatchToProps)(ThreadSelector)
