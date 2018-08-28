import React, {Component} from 'react'
import { connect } from 'react-redux'
import { View, Text, ScrollView, Dimensions } from 'react-native'
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
import { RootState } from '../../../Redux/Types';

const { width } = Dimensions.get('window')

type StateProps = {
  photoId: string,
  commentCardProps: CommentCardProps[]
}

type State = {
  drawer: boolean
}

class ThreadPhotoDetail extends Component<StateProps, State> {
  constructor (props: StateProps) {
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
    return (<ProgressiveImage
      imageId={this.props.photoId}
      previewPath={'small'}
      path={'photo'}
      style={[styles.mainPhoto, { height: width }]}
      resizeMode={'contain'}
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
        <CommentBox />
        {this.state.drawer && <BottomDrawerList/>}
      </View>
    )
  }
}

const mapStateToProps = (state: RootState): StateProps  => {
  const { threadId, photoId } = state.ui.viewingPhoto
  if (!threadId || !photoId) {
    throw 'no threadId or photoId'
  }
  const photo = state.textileNode.threads[threadId].photos.find(photo => photo.id === photoId)
  if (!photo) {
    throw 'no photo'
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
    commentCardProps: captionCommentCardProps ? [{...captionCommentCardProps}, ...commentCardProps] : commentCardProps
  }
}

export default connect(mapStateToProps)(ThreadPhotoDetail)
