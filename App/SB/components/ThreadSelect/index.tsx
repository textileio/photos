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
  renderCreateThread = () => {
    return (
      <ThreadCreateCard onSelect={this.props.createNew} />
    )
  }
  renderHeader = () => {
    if (this.props.threads.length < 4) {
      // Only freeze a top row if the list is on the longer side
      return (<View/>)
    } else if (this.props.selectedThreadId) {
      const thread = this.props.threads.find((t) => t.id === this.props.selectedThreadId)
      if (thread) {
        return (
          <ThreadSelectCard thread={thread} selected={true} />
        )
      }
    }
    return (
      <View style={styles.threadItem}>
        <View style={styles.missingItem}>
          <Text style={styles.missingText}>None selected</Text>
        </View>
      </View>
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
          {this.renderHeader()}
          <View style={styles.searchBoxPlaceholder} />
          <FlatList
            data={this.props.threads}
            ListFooterComponent={this.renderCreateThread}
            /* tslint:disable-next-line */
            keyExtractor={(item: ThreadData) => item.id}
            /* tslint:disable-next-line */
            renderItem={(data: any) => {
              const thread: ThreadData = data.item
              return (
                <ThreadSelectCard
                  thread={thread}
                  selected={this.props.selectedThreadId === thread.id}
                  disabled={this.props.threads.length >= 4 && this.props.selectedThreadId === thread.id}
                  onSelect={this.props.selectThread}
                />
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
  const defaultThreadName: ThreadName = 'default' as any
  if (allThreads.length > 0) {
    threads = allThreads
      .filter((thread) => thread.name !== defaultThreadName)
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
