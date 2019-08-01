import React, { Component } from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { View, ScrollView, ViewStyle, Clipboard } from 'react-native'
import { NavigationActions, SafeAreaView } from 'react-navigation'
import Textile, { IComment } from '@textile/react-native-sdk'
import ActionSheet from 'react-native-actionsheet'

import { TextileHeaderButtons, Item } from '../Components/HeaderButtons'

import KeyboardResponsiveContainer from '../Components/KeyboardResponsiveContainer'
import CommentCard, {
  Props as CommentCardProps
} from '../SB/components/CommentCard'
import CommentBox from '../SB/components/CommentBox/CommentBox'

import styles from './Styles/CommentsStyle'
import PhotoViewingActions from '../Redux/PhotoViewingRedux'
import { RootState, RootAction } from '../Redux/Types'
import { groupActions } from '../features/group'
import { accountSelectors } from '../features/account'

interface StateProps {
  selfAddress: string
  captionCommentCardProps?: CommentCardProps
  removing: string[]
  comments: IComment[]
  commentValue?: string
  commentError?: boolean
}

interface DispatchProps {
  updateComment: (comment: string) => void
  submitComment: () => void
  remove: (id: string) => void
}

interface ComponentState {
  submitting: boolean
  // The current selected block (message/photo). For use in the block action sheet
  selected?: {
    blockId: string
    text: string
  }
}

type Props = StateProps & DispatchProps

class Comments extends Component<Props, ComponentState> {
  // @ts-ignore
  static navigationOptions = ({ navigation }) => {
    const headerLeft = (
      <TextileHeaderButtons left={true}>
        {/* tslint:disable-next-line jsx-no-lambda */}
        <Item
          title="Back"
          iconName="arrow-left"
          onPress={() => {
            navigation.dispatch(NavigationActions.back())
          }}
        />
      </TextileHeaderButtons>
    )
    return {
      headerLeft,
      headerTitle: 'Comments'
    }
  }

  scrollView?: ScrollView
  // Action sheet to handle block options like removing (ignoring) a comment
  blockActionSheet: any

  constructor(props: Props) {
    super(props)
    this.state = {
      submitting: false
    }
  }

  scrollToEnd = () => {
    if (this.scrollView) {
      this.scrollView.scrollToEnd()
    }
  }

  componentDidUpdate(previousProps: Props) {
    if (this.props.comments.length > previousProps.comments.length) {
      // New comment added, scroll down, need timeout to allow rendering
      setTimeout(this.scrollToEnd, 100)
    }
    if (
      this.props.commentValue === undefined &&
      this.state.submitting === true
    ) {
      // the comment was flushed so we can type a new one and submit again
      this.setState({ submitting: false })
    } else if (
      this.props.commentError === true &&
      this.state.submitting === true
    ) {
      // there was an error, allow a retry
      this.setState({ submitting: false })
    }
  }

  onSubmit = () => {
    if (this.state.submitting) {
      return
    }
    // lock up submissions until the comment gets flushed
    this.setState({ submitting: true })
    this.props.submitComment()
  }

  render() {
    // Block action sheet
    const blockActionSheetOptions = ['Remove', 'Copy', 'Cancel']
    const blockCancelButtonIndex = blockActionSheetOptions.indexOf('Cancel')
    const commentCardProps = this.props.comments
      .slice()
      .reverse()
      .map(comment => {
        const isOwnPhoto = this.props.selfAddress === comment.user.address
        const isRemoving = this.props.removing.indexOf(comment.id) !== -1
        const canRemove = isOwnPhoto && !isRemoving
        const props: CommentCardProps = {
          username: comment.user.name || 'unknown',
          avatar: comment.user.avatar,
          comment: comment.body,
          date: Textile.util.timestampToDate(comment.date),
          isCaption: false,
          onLongPress: canRemove
            ? () => this.showBlockActionSheet(comment.id, comment.body)
            : undefined
        }
        return props
      })
    return (
      <SafeAreaView style={styles.safeContainer}>
        <KeyboardResponsiveContainer style={styles.container as ViewStyle}>
          {this.props.captionCommentCardProps && (
            <CommentCard {...this.props.captionCommentCardProps} />
          )}
          <ScrollView
            ref={ref => (this.scrollView = ref ? ref : undefined)}
            style={styles.contentContainer}
          >
            <View>
              {commentCardProps.map((commentCardProps, i) => (
                <CommentCard key={i} {...commentCardProps} />
              ))}
            </View>
          </ScrollView>
          <CommentBox
            onUpdate={this.props.updateComment}
            onSubmit={this.onSubmit}
            value={this.props.commentValue}
            showError={this.props.commentError}
          />
        </KeyboardResponsiveContainer>
        <ActionSheet
          ref={(o: any) => {
            this.blockActionSheet = o
          }}
          title={'Comment options'}
          options={blockActionSheetOptions}
          cancelButtonIndex={blockCancelButtonIndex}
          onPress={this.handleBlockActionSheetResponse}
        />
      </SafeAreaView>
    )
  }

  showBlockActionSheet = (blockId: string, text: string) => {
    this.setState({
      selected: {
        blockId,
        text
      }
    })
    this.blockActionSheet.show()
  }

  handleBlockActionSheetResponse = (index: number) => {
    const actions = [
      () =>
        this.state.selected && this.props.remove(this.state.selected.blockId),
      () => this.state.selected && Clipboard.setString(this.state.selected.text)
    ]
    if (index < actions.length) {
      actions[index]()
    }
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  const selfAddress = accountSelectors.getAddress(state.account) || ''
  const { viewingPhoto } = state.photoViewing

  let captionCommentCardProps: CommentCardProps | undefined
  if (viewingPhoto && viewingPhoto.caption) {
    captionCommentCardProps = {
      username: viewingPhoto.user.name || viewingPhoto.user.address,
      avatar: viewingPhoto.user.avatar,
      comment: viewingPhoto.caption,
      date: Textile.util.timestampToDate(viewingPhoto.date),
      isCaption: true
    }
  }

  const comments = viewingPhoto ? viewingPhoto.comments : []

  const removing = Object.keys(state.group.ignore).filter(key => {
    return state.group.ignore[key] !== {}
  })

  return {
    selfAddress,
    captionCommentCardProps,
    comments,
    removing,
    commentValue: state.photoViewing.authoringComment,
    commentError: state.photoViewing.authoringCommentError
  }
}

const mapDispatchToProps = (
  dispatch: Dispatch<RootAction>,
  ownProps: Props
): DispatchProps => ({
  updateComment: (comment: string) =>
    dispatch(PhotoViewingActions.updateComment(comment)),
  submitComment: () => dispatch(PhotoViewingActions.addCommentRequest()),
  remove: (id: string) => dispatch(groupActions.ignore.ignore.request(id))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Comments)
