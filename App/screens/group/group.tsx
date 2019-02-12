import React, { Component } from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { View, Text, FlatList } from 'react-native'
import { NavigationScreenProps } from 'react-navigation'

import { Item } from '../../features/group/models'
import { RootState, RootAction } from '../../Redux/Types'
import { feedItems } from '../../features/group/selectors'
import { groupActions } from '../../features/group'

interface StateProps {
  items: ReadonlyArray<Item>
}

interface DispatchProps {
  refresh: () => void
}

interface NavProps {
  threadId: string
}

type Props = StateProps & DispatchProps & NavigationScreenProps<NavProps>

class Group extends Component<Props> {

  componentDidMount() {
    this.props.navigation.addListener('willFocus', this.onFocus)
  }

  render () {
    return (
      <View style={{ flex: 1 }}>
        <Text style={{ flex: 1 }}>{this.props.items.toString()}</Text>
      </View>
    )
  }

  onFocus = () => {
    this.props.refresh()
  }
}

const mapStateToProps = (state: RootState, ownProps: NavigationScreenProps<NavProps>): StateProps => {
  const threadId = ownProps.navigation.getParam('threadId')
  const items = feedItems(state.group, threadId) || []
  return {
    items
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>, ownProps: NavigationScreenProps<NavProps>): DispatchProps => {
  const threadId = ownProps.navigation.getParam('threadId')
  return {
    refresh: () => dispatch(groupActions.feed.refreshFeed.request({ id: threadId }))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Group)
