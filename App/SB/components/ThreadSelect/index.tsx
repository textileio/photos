import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'

import { View, Text, FlatList, ListRenderItemInfo } from 'react-native'

import { RootState, RootAction } from '../../../Redux/Types'
import ThreadSelectCard from './ThreadSelectCard'
import ThreadCreateCard from './ThreadCreateCard'
import {getThreads} from '../../../Redux/PhotoViewingSelectors'
import {ThreadData} from '../../../Redux/PhotoViewingRedux'
import UIActions from '../../../Redux/UIRedux'

import styles from './statics/styles'

interface ComponentProps {
  createNew: () => void
  select: (threadId: string) => void
  threads: ReadonlyArray<ThreadData>
  selected?: string
}

export class ThreadSelectComponent extends React.Component<ComponentProps> {
  renderCreateThread = () => {
    return (
      <ThreadCreateCard onSelect={this.props.createNew} />
    )
  }

  renderRow = (data: ListRenderItemInfo<ThreadData>) => {
    const thread = data.item
    return (
      <ThreadSelectCard
        thread={thread}
        selected={this.props.selected === thread.id}
        disabled={this.props.threads.length >= 4 && this.props.selected === thread.id}
        onSelect={this.props.select}
      />
    )
  }

  renderHeader = () => {
    if (this.props.threads.length < 4) {
      // Only freeze a top row if the list is on the longer side
      return (<View/>)
    } else if (this.props.selected) {
      const thread = this.props.threads.find((t) => t.id === this.props.selected)
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
      <View style={styles.body}>
        {this.renderHeader()}
        <View style={styles.searchBoxPlaceholder} />
        <FlatList
          data={this.props.threads}
          ListHeaderComponent={this.renderCreateThread}
          /* tslint:disable-next-line */
          keyExtractor={(item: ThreadData) => item.id}
          /* tslint:disable-next-line */
          renderItem={this.renderRow}
          extraData={this.props.selected}
        />
      </View>
    )
  }
}

export interface ScreenProps {
  createNew: () => void
}

interface StateProps {
  threads: ReadonlyArray<ThreadData>
  selectedThreadId?: string
}

interface DispatchProps {
  selectThread: (threadId: string) => void
}

type Props = StateProps & DispatchProps

class ThreadSelect extends React.Component<ScreenProps & Props> {
  renderCreateThread = () => {
    return (
      <ThreadCreateCard onSelect={this.props.createNew} />
    )
  }

  render () {
    return (
      <View style={styles.contentContainer}>
        <View style={styles.header}>
          <View style={styles.headerTitle}>
            <Text style={styles.title}>Select Group</Text>
          </View>
        </View>
        <View style={{flex: 1}}>
          <ThreadSelectComponent
            createNew={this.props.createNew}
            select={this.props.selectThread}
            threads={this.props.threads}
            selected={this.props.selectedThreadId}
          />
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state: RootState): StateProps  => {

  const selectedThreadId = state.ui.sharingPhoto ? state.ui.sharingPhoto.threadId : undefined

  return {
    threads: getThreads(state, 'name'),
    selectedThreadId
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => ({
  selectThread: (threadId: string) => { dispatch(UIActions.updateSharingPhotoThread(threadId)) }
})

export default connect(mapStateToProps, mapDispatchToProps)(ThreadSelect)
