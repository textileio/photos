import React from 'react'
import { Dispatch } from 'redux'
import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux'
import { FlatList, View, Text, TouchableOpacity } from 'react-native'

import { RootAction, RootState } from '../Redux/Types'

import { getSharedThreads } from '../Redux/GroupsSelectors'
import { contactsSelectors } from '../features/contacts'
import TextileEventsActions from '../Redux/TextileEventsRedux'
import UIActions from '../Redux/UIRedux'

import { IContact } from '@textile/react-native-sdk'

import GroupCard from './GroupCard'
import styles from './Styles/ThreadSelectorStyles'
import { accountSelectors } from '../features/account'

interface ScreenProps {
  createNewThread: () => void
}

class ThreadSelector extends React.Component<
  ScreenProps & StateProps & DispatchProps & NavigationScreenProps<{}>
> {
  _onPressItem = (threadCardProps: any) => {
    const { id, name } = threadCardProps
    this.props.navigateToThread(id, name)
  }

  _renderItem = (rowData: any) => {
    const item: GroupAuthors = rowData.item
    return <GroupCard id={item.id} {...item} onPress={this._onPressItem} />
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

  render() {
    return (
      <View style={styles.contentContainer}>
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
  readonly members: IContact[]
  readonly thumb?: string
  readonly valid: boolean
}

interface StateProps {
  threads: ReadonlyArray<GroupAuthors>
}

function mapStateToProps(state: RootState): StateProps {
  const ownAddress = accountSelectors.getAddress(state.account)
  const profile = state.account.profile.value
  const threads = getSharedThreads(state, 'date').map(thread => {
    const selector = contactsSelectors.makeByThreadId(thread.id)
    const members = selector(state.contacts).filter(
      contact => contact.address !== ownAddress
    )
    if (profile && members.length < 8) {
      members.unshift(profile)
    }
    return {
      id: thread.id,
      name: thread.name,
      // total number of images in the thread
      size: thread.size,
      members,
      thumb: thread.thumb,
      valid: thread.valid
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

function mapDispatchToProps(dispatch: Dispatch<RootAction>): DispatchProps {
  return {
    refreshMessages: () => {
      dispatch(TextileEventsActions.refreshMessagesRequest())
    },
    navigateToThread: (id: string, name: string) => {
      dispatch(UIActions.navigateToThreadRequest(id, name))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ThreadSelector)
