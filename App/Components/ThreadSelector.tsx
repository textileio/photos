import React from 'react'
import {Dispatch} from 'redux'
import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux'
import { FlatList, View, Text, TouchableOpacity } from 'react-native'

import {ThreadId, ThreadName} from '../Models/TextileTypes'
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
    this.props.navigateToThread(id as ThreadId, name as ThreadName)
  }

  _renderItem = (rowData: any) => {
    const item: ThreadData = rowData.item
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
  navigateToThread: (id: ThreadId, name: ThreadName) => void
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => {
  return {
    refreshMessages: () => {
      dispatch(TextileNodeActions.refreshMessagesRequest())
    },
    navigateToThread: (id: ThreadId, name: ThreadName) => {
      dispatch(UIActions.navigateToThreadRequest(id, name))
    }
  }
}

export default connect(undefined, mapDispatchToProps)(ThreadSelector)
