import React from 'react'
import {Dispatch} from 'redux'
import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux'
import { FlatList, View, Text, TouchableOpacity } from 'react-native'

import {RootAction, RootState} from '../Redux/Types'

import { getThreads } from '../Redux/PhotoViewingSelectors'
import TextileNodeActions from '../Redux/TextileNodeRedux'
import UIActions from '../Redux/UIRedux'

import ThreadCard from '../SB/components/ThreadListCard'
import styles from './Styles/ThreadSelectorStyles'
import { ThreadFilesInfo } from '../NativeModules/Textile'

interface ScreenProps {
  createNewThread: () => void
}

class ThreadSelector extends React.Component<ScreenProps & StateProps & DispatchProps & NavigationScreenProps<{}>> {

  _onPressItem = (threadCardProps: any) => {
    const { id, name } = threadCardProps
    this.props.navigateToThread(id, name)
  }

  _renderItem = (rowData: any) => {
    const item: ThreadPreview = rowData.item
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
        <Text style={styles.createThreadText}>Create New Group</Text>
      </TouchableOpacity>
    )
  }

  _onRefresh = () => {
    this.props.refreshMessages()
  }

  _keyExtractor = (item: ThreadPreview) => item.id

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

interface ThreadPreview {
  readonly id: string
  readonly name: string
  readonly size: number
  readonly photos: ReadonlyArray<ThreadFilesInfo>
  readonly userCount: number
  readonly updated: number
  readonly latestPeerId?: string
}

interface StateProps {
  threads: ReadonlyArray<ThreadPreview>
}

const mapStateToProps = (state: RootState): StateProps => {
  const threads = getThreads(state, 'date')
    .map((thread) => {
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
    })
  return {
    threads
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

export default connect(mapStateToProps, mapDispatchToProps)(ThreadSelector)
