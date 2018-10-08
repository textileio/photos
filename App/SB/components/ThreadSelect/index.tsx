import React, {Component} from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { View, Text, FlatList } from 'react-native'

import { RootState, RootAction } from '../../../Redux/Types'
import ThreadSelectCard from './ThreadSelectCard'
import {getThreads} from '../../../Redux/PhotoViewingSelectors'
import {ThreadData} from '../../../Redux/PhotoViewingRedux'
import {ThreadId} from '../../../Models/TextileTypes'
import UIActions from '../../../Redux/UIRedux'

import styles from './statics/styles'

interface StateProps {
  threads: ReadonlyArray<ThreadData>
  selectedThreadId?: ThreadId
}

interface DispatchProps {
  selectThread: (threadId: ThreadId) => void
}

type Props = StateProps & DispatchProps

class ThreadSelect extends Component<Props> {
  render () {
    return (
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <View style={styles.headerTitle}>
            <Text style={styles.title}>Select a Thread</Text>
          </View>
        </View>
        <View style={styles.body}>
          <View style={styles.searchBoxPlaceholder} />
          <FlatList
            data={this.props.threads}
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
  const allThreads = getThreads(state)
  let threads: ThreadData[] = []
  if (allThreads.length > 0) {
    threads = allThreads
      .filter((thread) => thread.name !== 'default')
  }
  const selectedThreadId = state.ui.sharingPhoto ? state.ui.sharingPhoto.threadId : undefined
  return {
    threads,
    selectedThreadId
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>, ownProps: Props): DispatchProps => ({
  selectThread: (threadId: ThreadId) => { dispatch(UIActions.updateSharingPhotoThread(threadId)) }
})

export default connect(mapStateToProps, mapDispatchToProps)(ThreadSelect)
