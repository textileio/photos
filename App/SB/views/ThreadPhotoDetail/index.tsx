import React, {Component} from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { View, KeyboardAvoidingView, ScrollView, Dimensions } from 'react-native'
import { NavigationActions } from 'react-navigation'

import { TextileHeaderButtons, Item } from '../../../Components/HeaderButtons'

import Toolbar from '../../components/Toolbar'
import BottomDrawerList from '../../components/BottomDrawerList'
import CommentCard, { Props as CommentCardProps } from '../../components/CommentCard'
import CommentBox from '../../components/CommentBox/CommentBoxContainer'

import ProgressiveImage from '../../../Components/ProgressiveImage'

import styles from './statics/styles'
import comments from './constants'
import UIActions from '../../../Redux/UIRedux'
import { RootState, RootAction } from '../../../Redux/Types'
import { BlockId, PhotoId } from '../../../Models/TextileTypes'

const { width } = Dimensions.get('window')

type StateProps = {
  photoId: PhotoId,
  blockId: BlockId,
  size?: {
    height: number
    width: number
  }
  commentCardProps: CommentCardProps[]
}

type DispatchProps = {
  updateComment: (comment: string) => void
  submitComment: () => void
}

type State = {
  drawer: boolean
}

type Props = StateProps & DispatchProps

class ThreadPhotoDetail extends Component<Props, State> {
  constructor (props: Props) {
    super(props)
    this.state = {
      drawer: false
    }
  }

  static navigationOptions = ({ navigation }) => {
    const headerLeft = (
      <TextileHeaderButtons left>
        <Item title='Back' iconName='arrow-left' onPress={() => { navigation.dispatch(NavigationActions.back()) }} />
      </TextileHeaderButtons>
    )
    return {
      headerLeft
    }
  }

  renderImage () {
    const height = this.props.size ? (this.props.size.height / this.props.size.width) * width : width
    return (<ProgressiveImage
      imageId={this.props.photoId}
      previewPath={'small'}
      path={'photo'}
      style={[styles.mainPhoto, { height }]}
      resizeMode={'cover'}
    />)
  }

  render () {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.contentContainer}>
          {this.renderImage()}
          {/*<ImageSc style={styles.mainPhoto} width={width} source={require('./statics/photo2.png')}/>*/}
          <View style={styles.commentsContainer}>
            {this.props.commentCardProps.map((commentCardProps, i) => (
              <CommentCard key={i} {...commentCardProps} />
            ))}
          </View>
        </ScrollView>
        <CommentBox onUpdate={this.props.updateComment} onSubmit={this.props.submitComment} />
        {this.state.drawer && <BottomDrawerList/>}
      </View>
    )
  }
}

const mapStateToProps = (state: RootState): StateProps  => {
  const { threadId, photo } = state.ui.viewingPhoto
  if (!threadId || !photo) {
    throw 'no threadId or photoId'
  }

  let size: { height: number, width: number} | undefined
  if (photo.metadata) {
    size = { height: photo.metadata.height, width: photo.metadata.width }
  }

  let captionCommentCardProps: CommentCardProps | undefined
  if (photo.caption) {
    captionCommentCardProps = {
      username: photo.username || photo.author_id,
      avatarUri: 'https://cafe.textile.io/ipns/' + photo.author_id + '/avatar',
      comment: photo.caption,
      date: photo.date,
      isSubComment: false,
      subComments: []
    }
  }
  // TODO: comments should always be defined: https://github.com/textileio/textile-go/issues/270
  const comments = photo.comments || []
  const commentCardProps = comments.map(comment => {
    const props: CommentCardProps = {
      username: comment.username || 'unknown',
      avatarUri: 'https://cafe.textile.io/ipns/' + comment.author_id + '/avatar',
      comment: comment.body,
      date: comment.date,
      isSubComment: false,
      subComments: []
    }
    return props
  })
  return {
    photoId: photo.id,
    blockId: photo.block_id,
    size,
    commentCardProps: captionCommentCardProps ? [{...captionCommentCardProps}, ...commentCardProps] : commentCardProps
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>, ownProps: Props): DispatchProps => ({
  updateComment: (comment: string) => dispatch(UIActions.updateComment(comment)),
  submitComment: () => dispatch(UIActions.addCommentRequest())
})

export default connect(mapStateToProps, mapDispatchToProps)(ThreadPhotoDetail)
