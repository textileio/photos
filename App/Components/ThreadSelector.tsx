import React from 'react'
import {Dispatch} from 'redux'
import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux'
import { FlatList, View, Text, TouchableOpacity } from 'react-native'

import {RootAction, RootState} from '../Redux/Types'

import { getThreads } from '../Redux/PhotoViewingSelectors'
import { ContactsSelectors } from '../Redux/ContactsRedux'
import TextileNodeActions from '../Redux/TextileNodeRedux'
import UIActions from '../Redux/UIRedux'

import GroupCard from './GroupCard'
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
    const item: GroupAuthors = rowData.item
    return (
      <GroupCard id={item.id} {...item} onPress={this._onPressItem} />
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

  _keyExtractor = (item: GroupAuthors) => item.id

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

interface GroupAuthors {
  readonly id: string
  readonly name: string
  readonly size: number
  readonly authors: string[]
  readonly thumb?: ThreadFilesInfo
}

interface StateProps {
  threads: ReadonlyArray<GroupAuthors>
}

const mapStateToProps = (state: RootState): StateProps => {
  const ownId = state.account.peerId.value
  const threads = getThreads(state, 'date')
  .map((thread) => {
    const authors = ContactsSelectors.byThreadId(state, thread.id).map((contact) => contact.id).filter((id) => id !== ownId)
    if (ownId && authors.length < 8) {
      authors.unshift(ownId)
    }
    const thumb = thread.photos.length ? thread.photos[0] : undefined
    return {
      id: thread.id,
      name: thread.name,
      // total number of images in the thread
      size: thread.photos.length,
      authors,
      thumb
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
