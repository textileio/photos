import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { View, Text, Dimensions, TouchableOpacity, ImageURISource } from 'react-native'
import moment from 'moment'
import ProgressiveImage from '../../../Components/ProgressiveImage'
import { getHeight } from '../../../Services/PhotoUtils'
import Avatar from '../../../Components/Avatar'
import UIActions from '../../../Redux/UIRedux'

import styles from './statics/styles'
import Icons from '../../../Components/Icons'
import Colors from '../../../Themes/Colors'
import {Photo, BlockId, ThreadName, ThreadId, PeerId} from '../../../Models/TextileTypes'
import KeyValueText from '../../../Components/KeyValueText'
import { RootState, RootAction } from '../../../Redux/Types'

const WIDTH = Dimensions.get('window').width

interface OwnProps {
  item: {type: string, photo: Photo, threadId?: ThreadId, threadName?: ThreadName}, // TODO make proper type now
  recentCommentsCount: number,
  maxLinesPerComment: number,
  onComment: () => void
  onLikes: () => void
  displayThread?: boolean
}

interface StateProps {
  peerId: PeerId
  dateString: string
  defaultSource?: number | ImageURISource
  didLike: boolean
  isLiked: boolean
  totalLikes: number
  imageHeight: number
  imageWidth: number
  username: string,
  photoUsername: string
}

interface DispatchProps {
  addPhotoLike: (photoBlockId: BlockId) => void
  navigateToThread: (threadId: ThreadId, threadName: ThreadName) => void
}

class ThreadDetailCard extends React.PureComponent<OwnProps & StateProps & DispatchProps> {

  _threadSelect = (id?: ThreadId, name?: ThreadName) => {
    return () => {
      if (id && name) {
        this.props.navigateToThread(id as ThreadId, name as ThreadName)
      }
    }
  }

  _onLikePress = (photo: Photo) => {
    return () => {
      this.props.addPhotoLike(photo.block_id)
    }
  }

  renderLikes (isLiked: boolean, didLike: boolean, photo: Photo) {
    // you are the only like or there are no likes, return ''
    return !isLiked || (didLike && photo.likes.length === 1) ? undefined :
      (
        <TouchableOpacity onPress={this.props.onLikes}>
          <Text style={styles.likedText}>{photo.likes.length.toString() + (photo.likes.length > 1 ? ' likes' : ' like')}</Text>
        </TouchableOpacity>
      )
  }

  render () {
    const {
      item,
      peerId,
      dateString,
      defaultSource,
      didLike,
      isLiked,
      imageHeight,
      imageWidth,
      username,
      photoUsername,
      onComment
    } = this.props

    const { photo } = item

    const likeRow = this.renderLikes(isLiked, didLike, photo)

    let caption
    if (photo.caption && photo.caption.length > 0) {
      caption = <KeyValueText keyString={photoUsername} value={photo.caption} />
    } else {
      caption = <Text>{''}</Text>
    }

    const recentComments = photo.comments.slice(0, this.props.recentCommentsCount).reverse().map((comment, index) => {
      const username = comment.username || 'unknown'
      return <KeyValueText key={index} keyString={username as string} value={comment.body} numberOfLines={this.props.maxLinesPerComment} />
    })

    let commentCountDescription
    if (photo.comments.length > this.props.recentCommentsCount) {
      commentCountDescription = (
        <TouchableOpacity onPress={onComment} >
          <Text style={styles.commentCount}>See all {photo.comments.length} comments...</Text>
        </TouchableOpacity>
      )
    }

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader} >
          <Avatar style={styles.cardAvatar} width={18} height={18} peerId={peerId} defaultSource={defaultSource} />

          <Text style={styles.cardAction}>
            <Text style={styles.cardActionName}>
              {photoUsername === username ? 'You' : photoUsername}
            </Text> added a photo
          </Text>
          {this.props.displayThread &&
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.cardTargetTouch}
              onPress={this._threadSelect(item.threadId, item.threadName)}
            >
              <Text numberOfLines={1} style={styles.cardTarget}> in <Text style={styles.cardActionName}>{item.threadName}</Text></Text>
            </TouchableOpacity>}
        </View>
        <View style={[styles.cardImage, {width: imageWidth, height: imageHeight}]}>
          <View style={styles.imageStretch}>
            <ProgressiveImage
              imageId={photo.id}
              showPreview={true}
              forMinWidth={imageWidth}
              style={{...styles.image, width: imageWidth, height: imageHeight}}
              resizeMode={'cover'}
            />
          </View>
        </View>
        <View style={styles.cardFooter} >
          <View style={styles.cardFooterTop} >
            {didLike && <Icons name='heart' size={24} style={{ color: Colors.brandRed }} />}
            {!didLike &&
              <TouchableOpacity
                onPress={this._onLikePress(this.props.item.photo)}
              >
                <Icons name='heart' size={24} />
              </TouchableOpacity>
            }
            <TouchableOpacity onPress={onComment} style={styles.cardFooterTopItem} >
              <Icons name='comment' size={24} />
            </TouchableOpacity>
          </View>
          {isLiked && likeRow
          }
          {caption}
          {commentCountDescription}
          {recentComments}
          <View style={styles.cardFooterBottom} >
            <Text style={styles.detailUpdateTime}>{dateString.toUpperCase()}</Text>
          </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state: RootState, ownProps: OwnProps): StateProps => {
  const { profile } = state.preferences
  const { photo } = ownProps.item
  const date = moment(photo.date)
  const dateString = date.fromNow()
  const selfId = profile && profile.id

  const username = profile ? (profile.username || 'unknown') : 'unknown'
  const photoUsername = photo.username ? photo.username : photo.author_id.substring(0, 8)

  const defaultSource = require('../../views/Notifications/statics/main-image.png')

  const totalLikes = photo.likes ? photo.likes.length : 0
  const isLiked = photo.likes && photo.likes.length > 0
  const didLike = isLiked && photo.likes.find((like) => like.author_id === selfId) !== undefined

  // Unsquares the images by maintaining the aspect ratio no matter device size
  const imageWidth = WIDTH
  const heightProperties = getHeight(photo.metadata, imageWidth)
  const imageHeight = heightProperties.height
  return {
    peerId: photo.author_id,
    dateString,
    defaultSource,
    didLike,
    isLiked,
    totalLikes,
    imageHeight,
    imageWidth,
    username,
    photoUsername
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => {
  return {
    addPhotoLike: (photoBlockId: BlockId) => { dispatch(UIActions.addLikeRequest(photoBlockId)) },
    navigateToThread: (id: ThreadId, name: ThreadName) => {
     dispatch(UIActions.navigateToThreadRequest(id, name))
   }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreadDetailCard)
