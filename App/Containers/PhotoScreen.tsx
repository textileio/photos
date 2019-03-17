import React from 'react'
import { Dispatch } from 'redux'
import { NavigationScreenProps } from 'react-navigation'
import { connect } from 'react-redux'
import { ScrollView, ViewStyle, Dimensions } from 'react-native'
import { util } from '@textile/react-native-sdk'
import moment from 'moment'

import { pb } from '@textile/react-native-sdk'
import { RootState, RootAction } from '../Redux/Types'

import UIActions from '../Redux/UIRedux'
import Photo from '../Components/photo'
import {threadDataByThreadId} from '../Redux/PhotoViewingSelectors'

import { color } from '../styles'
import { CommentData } from '../Components/comments'

const screenWidth = Dimensions.get('screen').width

const momentSpec: moment.CalendarSpec = {
  sameDay: 'LT',
  nextDay: '[Tomorrow] LT',
  nextWeek: 'MMM DD LT',
  lastDay: 'MMM DD LT',
  lastWeek: 'MMM DD LT',
  sameElse: 'MMM DD LT'
}

const CONTAINER: ViewStyle = {
  backgroundColor: color.screen_primary
}

interface StateProps {
  photo?: pb.IFiles,
  selfAddress: string
  threadName?: string,
  threadId?: string
}

interface DispatchProps {
  addLike: (block: string) => void
}

type Props = StateProps & DispatchProps & NavigationScreenProps<{}>

class PhotoScreen extends React.Component<Props> {

  static navigationOptions = {
    title: 'Photo'
  }

  onComment = () => {
    this.props.navigation.navigate('Comments')
  }

  onLikes = () => {
    this.props.navigation.navigate('LikesScreen')
  }

  onAddLike = () => {
    if (this.props.photo) {
      this.props.addLike(this.props.photo.block)
    }
  }

  render () {
    if (!this.props.photo) {
      return <ScrollView style={CONTAINER} />
    }
    const { user, caption, date, target, files, likes, comments, block } = this.props.photo
    const hasLiked = likes.findIndex((likeInfo) => likeInfo.user.address === this.props.selfAddress) > -1
    const commentsData: ReadonlyArray<CommentData> = comments.map((comment) => {
      return {
        id: comment.id,
        username: comment.user.name || '?',
        body: comment.body
      }
    })
    return (
      <ScrollView style={CONTAINER}>
      {this.props.photo &&
        <Photo
          avatar={user.avatar}
          username={user.name || 'unknown'}
          message={caption.length > 0 ? caption : undefined}
          time={moment(util.timestampToDate(date)).calendar(undefined, momentSpec)}
          photoId={target}
          fileIndex={files[0].index}
          photoWidth={screenWidth}
          hasLiked={hasLiked}
          numberLikes={likes.length}
          onLike={this.onAddLike}
          onComment={this.onComment}
          comments={commentsData}
          onViewComments={this.onComment}
          commentsDisplayMax={10}
        />
      }
      </ScrollView>
    )
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  const threadId = state.photoViewing.viewingThreadId
  let threadName: string | undefined
  if (threadId) {
    const threadData = threadDataByThreadId(state, threadId)
    threadName = threadData ? threadData.name : undefined
  }
  const selfAddress = state.account.address.value || ''
  return {
    photo: state.photoViewing.viewingPhoto,
    threadName,
    threadId,
    selfAddress
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => ({
  addLike: (block: string) => dispatch(UIActions.addLikeRequest(block))
})

export default connect(mapStateToProps, mapDispatchToProps)(PhotoScreen)
