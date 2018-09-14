import React from 'react'
import Redux, { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { View, Text, Dimensions, TouchableOpacity, TouchableWithoutFeedback, ImageURISource } from 'react-native'
import ImageSc from 'react-native-scalable-image'
import moment from 'moment'
import ProgressiveImage from '../../../Components/ProgressiveImage'
import { getHeight } from '../../../Services/PhotoUtils'
import Avatar from '../../../Components/Avatar'
import UIActions from '../../../Redux/UIRedux'

import styles from './statics/styles'
import { Photo, BlockId } from '../../../Models/TextileTypes'
import KeyValueText from '../../../Components/KeyValueText'
import { RootState, RootAction } from '../../../Redux/Types'

const WIDTH = Dimensions.get('window').width

interface OwnProps {
  photo: Photo
  onSelect: () => void
}

interface StateProps {
  peerId: string
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
}

class ThreadDetailCard extends React.PureComponent<OwnProps & StateProps & DispatchProps> {

  onLikePress = () => {
    this.props.addPhotoLike(this.props.photo.block_id)
  }

  renderLikes (isLiked: boolean, didLike: boolean, photo: Photo) {
    // you are the only like or there are no likes, return ''
    return !isLiked || (didLike && photo.likes.length === 1) ? undefined :
      (
        <Text style={[styles.likedText]}>
          <Text style={[styles.profileName]}>{photo.likes.length.toString() + (photo.likes.length > 1 ? ' likes' : ' like')}</Text>
        </Text>
      )
  }

  render () {
    const {
      photo,
      peerId,
      dateString,
      defaultSource,
      didLike,
      isLiked,
      imageHeight,
      imageWidth,
      username,
      photoUsername,
      onSelect
    } = this.props

    const likeRow = this.renderLikes(isLiked, didLike, photo)

    let caption
    if (photo.caption && photo.caption.length > 0) {
      caption = <KeyValueText keyString={photoUsername} value={photo.caption} />
    } else {
      caption = <Text>{''}</Text>
    }

    const recentComments = photo.comments.slice(0, 2).map((comment, index) => {
      const username = comment.username || 'unknown'
      return <KeyValueText key={index} keyString={username} value={comment.body} numberOfLines={1} />
    })

    let commentCountDescription
    if (photo.comments.length > 2) {
      commentCountDescription = <Text style={styles.commentCount}>See all {photo.comments.length} comments...</Text>
    }

    return (
      <TouchableWithoutFeedback onPress={onSelect}>
        <View style={styles.card}>
          <View style={styles.cardHeader} >
            <Avatar style={styles.cardAvatar} width={18} height={18} peerId={peerId} defaultSource={defaultSource} />
            <Text style={styles.cardAction}><Text style={styles.cardActionName}>
              {photoUsername === username ? 'You' : photoUsername}
            </Text> added a photo</Text>
          </View>
          <View style={[styles.cardImage, {width: imageWidth, height: imageHeight}]}>
            <View style={styles.imageStretch}>
              <ProgressiveImage
                imageId={photo.id}
                previewPath={'small'}
                path={'medium'}
                style={[styles.image, {width: imageWidth, height: imageHeight}]}
                resizeMode={'cover'}
              />
            </View>
          </View>
          <View style={styles.cardFooter} >
            <View style={styles.cardFooterTop} >
              {didLike && <ImageSc width={32} source={require('../../../Images/v2/hearted.png')} />}
              {!didLike &&
                <TouchableOpacity onPress={this.onLikePress} >
                  <ImageSc width={32} source={require('../../../Images/v2/heart.png')} />
                </TouchableOpacity>
              }
            </View>
            {isLiked && likeRow
            }
            {caption}
            {recentComments}
            {commentCountDescription}
            <View style={styles.cardFooterBottom} >
              <Text style={styles.detailUpdateTime}>{dateString.toUpperCase()}</Text>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }
}

const mapStateToProps = (state: RootState, ownProps: OwnProps): StateProps => {
  const { profile } = state.preferences
  const { photo } = ownProps
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
    addPhotoLike: (photoBlockId: BlockId) => { dispatch(UIActions.addLikeRequest(photoBlockId)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreadDetailCard)
