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
import PhotoViewingActions from '../../../Redux/PhotoViewingRedux'
import { RootState, RootAction } from '../../../Redux/Types'
import { BlockId, PhotoId } from '../../../Models/TextileTypes'

const { width } = Dimensions.get('window')

type StateProps = {
  photoId: PhotoId
  blockId: BlockId
  size?: {
    height: number
    width: number
  }
  commentCardProps: CommentCardProps[]
  commentValue: string | undefined
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
        <CommentBox onUpdate={this.props.updateComment} onSubmit={this.props.submitComment} value={this.props.commentValue} />
        {this.state.drawer && <BottomDrawerList/>}
      </View>
    )
  }
}

const mapStateToProps = (state: RootState): StateProps  => {
  const { viewingPhoto } = state.photoViewing
  if (!viewingPhoto) {
    throw 'no viewing thread or photo'
  }

  let size: { height: number, width: number} | undefined
  if (viewingPhoto.metadata) {
    size = { height: viewingPhoto.metadata.height, width: viewingPhoto.metadata.width }
  }

  let captionCommentCardProps: CommentCardProps | undefined
  if (viewingPhoto.caption) {
    captionCommentCardProps = {
      username: viewingPhoto.username || viewingPhoto.author_id,
      avatarUri: 'https://cafe.textile.io/ipns/' + viewingPhoto.author_id + '/avatar',
      comment: viewingPhoto.caption,
      date: viewingPhoto.date,
      isSubComment: false,
      subComments: []
    }
  }
  // TODO: comments should always be defined: https://github.com/textileio/textile-go/issues/270
  const comments = viewingPhoto.comments || []
  const commentCardProps = comments.slice().reverse().map(comment => {
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
    photoId: viewingPhoto.id,
    blockId: viewingPhoto.block_id,
    size,
    commentCardProps: captionCommentCardProps ? [{...captionCommentCardProps}, ...commentCardProps] : commentCardProps,
    commentValue : state.photoViewing.authoringComment
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>, ownProps: Props): DispatchProps => ({
  updateComment: (comment: string) => dispatch(PhotoViewingActions.updateComment(comment)),
  submitComment: () => dispatch(PhotoViewingActions.addCommentRequest())
})

export default connect(mapStateToProps, mapDispatchToProps)(ThreadPhotoDetail)
