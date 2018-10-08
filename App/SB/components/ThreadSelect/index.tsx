import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { View, Text, FlatList } from 'react-native'
import {NavigationScreenProps} from 'react-navigation'

import { RootState, RootAction } from '../../../Redux/Types'
import ThreadSelectCard from './ThreadSelectCard'
import ThreadCreateCard from './ThreadCreateCard'
import {getThreads} from '../../../Redux/PhotoViewingSelectors'
import {ThreadData} from '../../../Redux/PhotoViewingRedux'
import {ThreadId, ThreadName} from '../../../Models/TextileTypes'
import UIActions from '../../../Redux/UIRedux'

import styles from './statics/styles'

export interface ScreenProps {
  createNew: () => void
}

interface StateProps {
  threads: ReadonlyArray<ThreadData>
  selectedThreadId?: ThreadId
}

interface DispatchProps {
  selectThread: (threadId: ThreadId) => void
}

type Props = StateProps & DispatchProps

class ThreadSelect extends React.Component<ScreenProps & Props> {
  _renderCreateThread = () => {
    return (
      <ThreadCreateCard onSelect={this.props.createNew} />
    )
  }
  render () {
    return (
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <View style={styles.headerTitle}>
            <Text style={styles.title}>Select Thread</Text>
          </View>
        </View>
        <View style={styles.body}>
          <View style={styles.searchBoxPlaceholder} />
          <FlatList
            data={this.props.threads}
            ListFooterComponent={this._renderCreateThread}
            /* tslint:disable-next-line */
            keyExtractor={(item: ThreadData) => item.id}
            /* tslint:disable-next-line */
            renderItem={(data: any) => {
              const thread: ThreadData = data.item
              return (
                <ThreadSelectCard thread={thread} selected={this.props.selectedThreadId === thread.id} onSelect={this.props.selectThread} />
              )
            }}
          />
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state: RootState): StateProps  => {

  const selectedThreadId = state.ui.sharingPhoto ? state.ui.sharingPhoto.threadId : undefined

  const allThreads = getThreads(state)
  let threads: ThreadData[] = []
  if (allThreads.length > 0) {
    threads = allThreads
      .filter((thread) => thread.name !== 'default')
      .sort((a, b) => {
        if (a.id === selectedThreadId) {
          return 0
        } else if (b.id === selectedThreadId || a.photos.length < b.photos.length) {
          return 1
        } else {
          return 0
        }
      })
  }

  return {
    threads,
    selectedThreadId
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => ({
  selectThread: (threadId: ThreadId) => { dispatch(UIActions.updateSharingPhotoThread(threadId)) }
})

export default connect(mapStateToProps, mapDispatchToProps)(ThreadSelect)
