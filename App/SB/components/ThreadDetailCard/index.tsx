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
import Icon from '../../../Components/Icon'
import Colors from '../../../Themes/Colors'
import { ThreadFilesInfo } from '../../../NativeModules/Textile'
import KeyValueText from '../../../Components/KeyValueText'
import { RootState, RootAction } from '../../../Redux/Types'

const WIDTH = Dimensions.get('window').width

interface OwnProps {
  item: {type: string, photo: ThreadFilesInfo, threadId?: string, threadName?: string}, // TODO make proper type now
  recentCommentsCount: number,
  maxLinesPerComment: number,
  onComment: () => void
  onLikes: () => void
  displayThread?: boolean
}

interface StateProps {
  peerId: string
  dateString: string
  didLike: boolean
  isLiked: boolean
  totalLikes: number
  imageHeight: number
  imageWidth: number
  username: string,
  photoUsername: string
}

interface DispatchProps {
  addPhotoLike: (photoBlockId: string) => void
  navigateToThread: (threadId: string, threadName: string) => void
}

class ThreadDetailCard extends React.PureComponent<OwnProps & StateProps & DispatchProps> {

  _threadSelect = (id?: string, name?: string) => {
    return () => {
      if (id && name) {
        this.props.navigateToThread(id, name)
      }
    }
  }

  _onLikePress = (photo: ThreadFilesInfo) => {
    return () => {
      this.props.addPhotoLike(photo.block)
    }
  }

  renderLikes (isLiked: boolean, didLike: boolean, photo: ThreadFilesInfo) {
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
      didLike,
      isLiked,
      imageHeight,
      imageWidth,
      username,
      photoUsername,
      onComment
    } = this.props

    const { photo } = item
    const recentCommentsCount = this.props.recentCommentsCount === -1 ? photo.comments.length : this.props.recentCommentsCount

    const likeRow = this.renderLikes(isLiked, didLike, photo)

    let caption
    if (photo.caption && photo.caption.length > 0) {
      caption = <KeyValueText keyString={photoUsername} value={photo.caption} />
    } else {
      caption = <Text>{''}</Text>
    }

    const recentComments = photo.comments.slice(0, recentCommentsCount).reverse().map((comment, index) => {
      const username = comment.username || 'unknown'
      return <KeyValueText key={index} keyString={username as string} value={comment.body} numberOfLines={this.props.maxLinesPerComment} />
    })

    let commentCountDescription
    if (photo.comments.length > recentCommentsCount) {
      commentCountDescription = (
        <TouchableOpacity onPress={onComment} >
          <Text style={styles.commentCount}>See all {photo.comments.length} comments...</Text>
        </TouchableOpacity>
      )
    }

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader} >
          <Avatar style={styles.cardAvatar} peerId={peerId} />

          <Text style={styles.cardAction}>
            <Text style={styles.cardActionName}>{photoUsername}</Text> added a photo
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
              imageId={photo.target}
              fileIndex={photo.files[0].index}
              showPreview={true}
              forMinWidth={imageWidth}
              style={{...styles.image, width: imageWidth, height: imageHeight}}
              resizeMode={'cover'}
            />
          </View>
        </View>
        <View style={styles.cardFooter} >
          <View style={styles.cardFooterTop} >
            {didLike && <Icon name='heart' size={24} style={{ color: Colors.brandRed }} />}
            {!didLike &&
              <TouchableOpacity
                onPress={this._onLikePress(this.props.item.photo)}
              >
                <Icon name='heart' size={24} />
              </TouchableOpacity>
            }
            <TouchableOpacity onPress={onComment} style={styles.cardFooterTopItem} >
              <Icon name='comment' size={24} />
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
  const profile = state.account.profile.value
  const peerId = state.account.peerId.value
  const { photo } = ownProps.item
  const date = moment(photo.date)
  const dateString = date.fromNow()

  const username = profile ? (profile.username || 'unknown') : 'unknown'
  const photoUsername = peerId === photo.author_id ? 'You' : photo.username ? photo.username : photo.author_id.substring(0, 8)

  const totalLikes = photo.likes ? photo.likes.length : 0
  const isLiked = photo.likes.length > 0
  const didLike = isLiked && photo.likes.find((like) => like.author_id === peerId) !== undefined

  // Unsquares the images by maintaining the aspect ratio no matter device size
  const imageWidth = WIDTH
  const links = photo.files[0].links
  const meta = links ? links['thumb'].meta : undefined
  const width = meta ? meta['width'] as number : undefined
  const height = meta ? meta['height'] as number : undefined
  let imageHeight = imageWidth
  if (width && height) {
    const ratio = width / height
    imageHeight = imageWidth / ratio
  }
  return {
    peerId: photo.author_id,
    dateString,
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
    addPhotoLike: (photoBlockId: string) => { dispatch(UIActions.addLikeRequest(photoBlockId)) },
    navigateToThread: (id: string, name: string) => {
     dispatch(UIActions.navigateToThreadRequest(id, name))
   }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreadDetailCard)
