import React, {Component} from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { View, ScrollView, Dimensions, ViewStyle, ImageStyle } from 'react-native'
import { NavigationActions } from 'react-navigation'

import { TextileHeaderButtons, Item } from '../../../Components/HeaderButtons'

import KeyboardResponsiveContainer from '../../../Components/KeyboardResponsiveContainer'
import BottomDrawerList from '../../components/BottomDrawerList'
import CommentCard, { Props as CommentCardProps } from '../../components/CommentCard'
import CommentBox from '../../components/CommentBox/CommentBox'

import ProgressiveImage from '../../../Components/ProgressiveImage'

import styles from './statics/styles'
import PhotoViewingActions from '../../../Redux/PhotoViewingRedux'
import { RootState, RootAction } from '../../../Redux/Types'

const { width } = Dimensions.get('window')

interface StateProps {
  photoId: string
  fileIndex: number
  blockId: string
  widthByHeightRatio?: number
  commentCardProps: CommentCardProps[]
  commentValue: string | undefined
}

interface DispatchProps {
  updateComment: (comment: string) => void
  submitComment: () => void
}

interface State {
  drawer: boolean
}

type Props = StateProps & DispatchProps

class ThreadPhotoDetail extends Component<Props, State> {
  // @ts-ignore
  static navigationOptions = ({ navigation }) => {
    const headerLeft = (
      <TextileHeaderButtons left={true}>
        {/* tslint:disable-next-line jsx-no-lambda */}
        <Item title='Back' iconName='arrow-left' onPress={() => { navigation.dispatch(NavigationActions.back()) }} />
      </TextileHeaderButtons>
    )
    return {
      headerLeft
    }
  }

  scrollView?: ScrollView

  constructor (props: Props) {
    super(props)
    this.state = {
      drawer: false
    }
  }

  scrollToEnd = () => {
    if (this.scrollView) {
      this.scrollView.scrollToEnd()
    }
  }

  componentDidUpdate (previousProps: Props, previousState: State) {
    if (this.props.commentCardProps.length > previousProps.commentCardProps.length) {
      // New comment added, scroll down, need timeout to allow rendering
      setTimeout(this.scrollToEnd, 100)
    }
  }

  renderImage () {
    const { widthByHeightRatio, photoId, fileIndex } = this.props
    const height = widthByHeightRatio ? width / widthByHeightRatio : width
    return (
      <ProgressiveImage
        imageId={photoId}
        fileIndex={fileIndex}
        showPreview={true}
        forMinWidth={width}
        style={{ ...styles.mainPhoto as ImageStyle, height }}
        resizeMode={'cover'}
      />
    )
  }

  render () {
    return (
      <KeyboardResponsiveContainer style={styles.container as ViewStyle} >
        <ScrollView ref={(ref) => this.scrollView = ref ? ref : undefined} style={styles.contentContainer}>
          {this.renderImage()}
          <View style={styles.commentsContainer}>
            {this.props.commentCardProps.map((commentCardProps, i) => (
              <CommentCard key={i} {...commentCardProps} />
            ))}
          </View>
        </ScrollView>
        <CommentBox onUpdate={this.props.updateComment} onSubmit={this.props.submitComment} value={this.props.commentValue} />
        {this.state.drawer && <BottomDrawerList/>}
      </KeyboardResponsiveContainer>
    )
  }
}

const mapStateToProps = (state: RootState): StateProps  => {
  const { viewingPhoto } = state.photoViewing
  if (!viewingPhoto) {
    throw new Error('no viewing thread or photo')
  }

  const links = viewingPhoto.files[0].links
  const meta = links ? links['thumb'].meta : undefined
  const width = meta ? meta['width'] as number : undefined
  const height = meta ? meta['height'] as number : undefined
  let widthByHeightRatio: number | undefined
  if (width && height) {
    widthByHeightRatio = width / height
  }

  let captionCommentCardProps: CommentCardProps | undefined
  if (viewingPhoto.caption) {
    captionCommentCardProps = {
      username: viewingPhoto.username || viewingPhoto.author_id,
      avatar: viewingPhoto.avatar,
      comment: viewingPhoto.caption,
      date: viewingPhoto.date,
      isCaption: true
    }
  }

  const comments = viewingPhoto.comments || []
  const commentCardProps = comments.slice().reverse().map((comment) => {
    const props: CommentCardProps = {
      username: comment.username || 'unknown',
      avatar: comment.avatar,
      comment: comment.body,
      date: comment.date,
      isCaption: false
    }
    return props
  })
  return {
    photoId: viewingPhoto.target,
    fileIndex: viewingPhoto.files[0].index,
    blockId: viewingPhoto.block,
    widthByHeightRatio,
    commentCardProps: captionCommentCardProps ? [{...captionCommentCardProps}, ...commentCardProps] : commentCardProps,
    commentValue : state.photoViewing.authoringComment
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>, ownProps: Props): DispatchProps => ({
  updateComment: (comment: string) => dispatch(PhotoViewingActions.updateComment(comment)),
  submitComment: () => dispatch(PhotoViewingActions.addCommentRequest())
})

export default connect(mapStateToProps, mapDispatchToProps)(ThreadPhotoDetail)
