import React from 'react'
import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux'
import { ScrollView, ViewStyle } from 'react-native'

import {Photo, ThreadId, ThreadName} from '../Models/TextileTypes'
import { RootState } from '../Redux/Types'

import ThreadDetailCard from '../SB/components/ThreadDetailCard'
import {threadDataByThreadId} from '../Redux/PhotoViewingSelectors'

const CONTAINER: ViewStyle = {
  backgroundColor: '#FAFCFE'
}

interface StateProps {
  photo?: Photo,
  threadName?: ThreadName,
  threadId?: ThreadId
}

class PhotoScreen extends React.Component<StateProps & NavigationScreenProps<{}>> {

  static navigationOptions = {
    title: 'Photo'
  }

  onComment = () => {
    this.props.navigation.navigate('Comments')
  }

  onLikes = () => {
    this.props.navigation.navigate('LikesScreen')
  }

  render () {
    return (
      <ScrollView style={CONTAINER}>
      {this.props.photo &&
        <ThreadDetailCard
          item={{type: 'photo', photo: this.props.photo, threadId: this.props.threadId, threadName: this.props.threadName}}
          onComment={this.onComment}
          onLikes={this.onLikes}
          recentCommentsCount={5}
          maxLinesPerComment={5}
        />
      }
      </ScrollView>
    )
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  const threadId = state.photoViewing.viewingThreadId
  let threadName
  if (threadId) {
    const threadData = threadDataByThreadId(state, threadId)
    threadName = threadData ? threadData.name : undefined
  }
  return {
    photo: state.photoViewing.viewingPhoto,
    threadName,
    threadId
  }
}

export default connect(mapStateToProps)(PhotoScreen)
