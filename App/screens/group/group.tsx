import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import {
  Text,
  FlatList,
  ListRenderItemInfo,
  Dimensions,
  TouchableWithoutFeedback,
  View
} from 'react-native'
import { NavigationScreenProps, SafeAreaView } from 'react-navigation'
import uuid from 'uuid/v4'
import ActionSheet from 'react-native-actionsheet'
import Textile, { IUser, Thread, FeedItemType } from '@textile/react-native-sdk'
import moment from 'moment'

import {
  TextileHeaderButtons,
  Item as TextileHeaderButtonsItem
} from '../../Components/HeaderButtons'
import KeyboardResponsiveContainer from '../../Components/KeyboardResponsiveContainer'
import AuthoringInput from '../../Components/authoring-input'
import InviteContactModal from '../../Components/InviteContactModal'
import Photo from '../../Components/photo'
import ProcessingImage from '../../Components/ProcessingImage'
import Message from '../../Components/message'
import Join from '../../Components/join'
import { Item } from '../../features/group/models'
import { RootState, RootAction } from '../../Redux/Types'
import { groupItems } from '../../features/group/selectors'
import { groupActions } from '../../features/group'
import UIActions from '../../Redux/UIRedux'
import PhotoViewingActions from '../../Redux/PhotoViewingRedux'
import { CommentData } from '../../Components/comments'
import { color } from '../../styles'
import { accountSelectors } from '../../features/account'
import RenameGroupModal from '../../Containers/RenameGroupModal'

const momentSpec: moment.CalendarSpec = {
  sameDay: 'LT',
  nextDay: '[Tomorrow] LT',
  nextWeek: 'MMM DD LT',
  lastDay: 'MMM DD LT',
  lastWeek: 'MMM DD LT',
  sameElse: 'MMM DD LT'
}

const screenWidth = Dimensions.get('screen').width

interface StateProps {
  items: ReadonlyArray<Item>
  groupName: string
  initiator: string
  selfAddress: string
  renaming: boolean
  canInvite: boolean
  liking: ReadonlyArray<string>
  removing: ReadonlyArray<string>
}

interface DispatchProps {
  refresh: () => void
  sendMessage: (message: string) => void
  showWalletPicker: () => void
  addPhotoLike: (block: string) => void
  navigateToComments: (photoId: string) => void
  leaveThread: () => void
  retryShare: (key: string) => void
  cancelShare: (key: string) => void
  remove: (blockId: string) => void
}

interface NavProps {
  threadId: string
  groupName: string
  showThreadActionSheet: () => void
}

type Props = StateProps & DispatchProps & NavigationScreenProps<NavProps>

interface State {
  showInviteContactModal: boolean
  showRenameGroupModal: boolean
  // The current selected block (message/photo). For use in the block action sheet
  selectedBlockId?: string
}

class Group extends React.PureComponent<Props, State> {
  static navigationOptions = ({
    navigation
  }: NavigationScreenProps<NavProps>) => {
    // const openDrawer = navigation.getParam('openDrawer')
    // const addContact = navigation.getParam('addContact')
    const groupName = navigation.getParam('groupName')
    const showThreadActionSheet = navigation.getParam('showThreadActionSheet')
    const back = () => navigation.goBack()
    const headerLeft = (
      <TextileHeaderButtons left={true}>
        <TextileHeaderButtonsItem
          title="Back"
          iconName="arrow-left"
          onPress={back}
        />
      </TextileHeaderButtons>
    )
    const headerRight = (
      <TextileHeaderButtons>
        <TextileHeaderButtonsItem
          title="More"
          iconName="more-vertical"
          onPress={showThreadActionSheet}
        />
      </TextileHeaderButtons>
    )
    return {
      headerLeft,
      headerTitle: groupName,
      headerRight
    }
  }

  // Action sheet to handle thread options like renaming the thread
  threadActionSheet: any
  // Action sheet to handle block options like removing (ignoring) a message
  blockActionSheet: any

  constructor(props: Props) {
    super(props)
    this.state = {
      showInviteContactModal: false,
      showRenameGroupModal: false
    }
  }

  componentDidMount() {
    this.props.navigation.addListener('willFocus', this.onFocus)
    this.props.navigation.setParams({
      groupName: this.props.groupName,
      showThreadActionSheet: this.showThreadActionSheet
    })
  }

  render() {
    const threadId = this.props.navigation.getParam('threadId')
    // Thread action sheet
    const threadActionSheetOptions = [
      ...(this.props.canInvite ? ['Invite Others'] : []),
      ...(this.props.selfAddress === this.props.initiator
        ? ['Rename Group']
        : []),
      'Leave Group',
      'Cancel'
    ]
    const threadCancelButtonIndex = threadActionSheetOptions.indexOf('Cancel')
    // Block action sheet
    const blockActionSheetOptions = ['Remove', 'Cancel']
    const blockCancelButtonIndex = blockActionSheetOptions.indexOf('Cancel')
    return (
      <SafeAreaView style={{ flex: 1, flexGrow: 1 }}>
        <KeyboardResponsiveContainer>
          <FlatList
            style={{ flex: 1, backgroundColor: color.screen_primary }}
            inverted={true}
            data={this.props.items}
            renderItem={this.renderRow}
            keyExtractor={this.keyExtractor}
            initialNumToRender={5}
            windowSize={5}
            onEndReachedThreshold={5}
            maxToRenderPerBatch={5}
          />
          <AuthoringInput
            containerStyle={{}}
            onSendMessage={this.submit}
            onSharePhoto={this.props.showWalletPicker}
          />
          <InviteContactModal
            isVisible={this.state.showInviteContactModal}
            cancel={this.hideInviteModal}
            selectedThreadId={threadId}
            selectedThreadName={this.props.groupName}
          />
          <ActionSheet
            ref={(o: any) => {
              this.threadActionSheet = o
            }}
            title={this.props.groupName + ' options'}
            options={threadActionSheetOptions}
            cancelButtonIndex={threadCancelButtonIndex}
            onPress={this.handleThreadActionSheetResponse}
          />
          <ActionSheet
            ref={(o: any) => {
              this.blockActionSheet = o
            }}
            title={'Options'}
            options={blockActionSheetOptions}
            cancelButtonIndex={blockCancelButtonIndex}
            onPress={this.handleBlockActionSheetResponse}
          />
          <RenameGroupModal
            isVisible={this.state.showRenameGroupModal}
            threadId={threadId}
            groupName={this.props.groupName}
            cancel={this.cancelRenameGroup}
            complete={this.completeRenameGroup}
          />
        </KeyboardResponsiveContainer>
      </SafeAreaView>
    )
  }

  sameUserAgain = (user: IUser, previous?: Item): boolean => {
    if (!previous) {
      return false
    }
    switch (previous.type) {
      case FeedItemType.Text: {
        return user.address === previous.value.user.address
      }
      default: {
        return false
      }
    }
  }

  keyExtractor = (item: Item) => {
    switch (item.type) {
      case 'addingMessage':
      case 'addingPhoto':
        return item.key
      default:
        return item.block
    }
  }

  renderRow = ({ item, index }: ListRenderItemInfo<Item>) => {
    switch (item.type) {
      case FeedItemType.Files: {
        const {
          user,
          caption,
          date,
          data,
          target,
          files,
          likes,
          comments,
          block
        } = item.value
        const isOwnPhoto = user.address === this.props.selfAddress
        const canRemove = isOwnPhoto && !this.removing(item.block)
        const hasLiked =
          likes.findIndex(
            likeInfo => likeInfo.user.address === this.props.selfAddress
          ) > -1 || this.liking(block)
        const commentsData: ReadonlyArray<CommentData> = comments.map(
          comment => {
            const isOwnComment = user.address === comment.user.address
            const isRemovingComment =
              this.props.removing.indexOf(comment.id) !== -1
            const canRemoveComment = isOwnComment && !isRemovingComment
            return {
              id: comment.id,
              username: comment.user.name || '?',
              body: comment.body,
              onLongPress: canRemoveComment
                ? () => this.showBlockActionSheet(comment.id)
                : undefined
            }
          }
        )
        // Get full size image constraints
        const def = screenWidth
        const pinchWidth = !files.length
          ? def
          : !files[0].links.large
          ? def
          : files[0].links.large.meta.fields.width.numberValue
        const pinchHeight = !files.length
          ? def
          : !files[0].links.large
          ? def
          : files[0].links.large.meta.fields.height.numberValue
        const fileIndex =
          files && files.length > 0 && files[0].index ? files[0].index : 0
        return (
          <Photo
            avatar={user.avatar}
            username={user.name.length > 0 ? user.name : 'unknown'}
            message={caption.length > 0 ? caption : undefined}
            time={moment(Textile.util.timestampToDate(date)).calendar(
              undefined,
              momentSpec
            )}
            photoId={data}
            fileIndex={fileIndex}
            photoWidth={screenWidth}
            hasLiked={hasLiked}
            numberLikes={likes.length}
            numberComments={comments.length}
            onLike={this.onLike(block)}
            onComment={this.onComment(target)}
            comments={commentsData}
            commentsDisplayMax={5}
            onViewComments={this.onComment(target)}
            pinchZoom={true}
            pinchWidth={pinchWidth}
            pinchHeight={pinchHeight}
            onLongPress={() => {
              if (canRemove) {
                this.showBlockActionSheet(item.block)
              }
            }}
          />
        )
      }
      case 'addingPhoto': {
        return (
          <ProcessingImage
            {...item.data}
            /* tslint:disable-next-line */
            retry={() => {
              this.props.retryShare(item.key)
            }}
            /* tslint:disable-next-line */
            cancel={() => {
              this.props.cancelShare(item.key)
            }}
          />
        )
      }
      case FeedItemType.Text: {
        const { user, body, date } = item.value
        const isSameUser = this.sameUserAgain(user, this.props.items[index + 1])
        const isOwnMessage = user.address === this.props.selfAddress
        const canRemove = isOwnMessage && !this.removing(item.block)
        const avatar = isSameUser ? undefined : user.avatar
        return (
          <TouchableWithoutFeedback
            disabled={!canRemove}
            onLongPress={() => this.showBlockActionSheet(item.block)}
          >
            <View>
              <Message
                avatar={avatar}
                username={user.name || 'unknown'}
                message={body}
                // TODO: deal with pb Timestamp to JS Date!
                time={moment(Textile.util.timestampToDate(date)).calendar(
                  undefined,
                  momentSpec
                )}
                isSameUser={isSameUser}
              />
            </View>
          </TouchableWithoutFeedback>
        )
      }
      case FeedItemType.Leave:
      case FeedItemType.Join: {
        const { user, date } = item.value
        const word = item.type === FeedItemType.Join ? 'joined' : 'left'
        return (
          <Join
            avatar={user.avatar}
            username={user.name || 'unknown'}
            message={`${word} ${this.props.groupName}`}
            time={moment(Textile.util.timestampToDate(date)).calendar(
              undefined,
              momentSpec
            )}
          />
        )
      }
      default:
        return <Text>{`${item.type}`}</Text>
    }
  }

  submit = (message: string) => this.props.sendMessage(message)

  onFocus = () => {
    this.props.refresh()
  }

  onLike = (block: string) => {
    return () => this.props.addPhotoLike(block)
  }

  onComment = (target: string) => {
    return () => this.props.navigateToComments(target)
  }

  showThreadActionSheet = () => {
    this.threadActionSheet.show()
  }

  showBlockActionSheet = (blockId: string) => {
    this.setState({
      selectedBlockId: blockId
    })
    this.blockActionSheet.show()
  }

  handleThreadActionSheetResponse = (index: number) => {
    const actions = [
      ...(this.props.canInvite ? [this.showInviteModal] : []),
      ...(this.props.selfAddress === this.props.initiator
        ? [this.showRenameGroupModal]
        : []),
      this.props.leaveThread
    ]
    if (index < actions.length) {
      actions[index]()
    }
  }

  handleBlockActionSheetResponse = (index: number) => {
    const actions = [
      () =>
        this.state.selectedBlockId &&
        this.props.remove(this.state.selectedBlockId)
    ]
    if (index < actions.length) {
      actions[index]()
    }
  }

  showInviteModal = () => {
    this.setState({ showInviteContactModal: true })
  }

  hideInviteModal = () => {
    this.setState({ showInviteContactModal: false })
  }

  showRenameGroupModal = () => {
    this.setState({ showRenameGroupModal: true })
  }

  hideRenameGroupModal = () => {
    this.setState({ showRenameGroupModal: false })
  }

  cancelRenameGroup = () => {
    this.hideRenameGroupModal()
  }

  completeRenameGroup = () => {
    this.hideRenameGroupModal()
    // Update navigation params in case groupName changed
    this.props.navigation.setParams({
      groupName: this.props.groupName
    })
  }

  liking = (blockId: string) => {
    return this.props.liking.indexOf(blockId) !== -1
  }

  removing = (blockId: string) => {
    return this.props.removing.indexOf(blockId) !== -1
  }
}

const mapStateToProps = (
  state: RootState,
  ownProps: NavigationScreenProps<NavProps>
): StateProps => {
  const threadId = ownProps.navigation.getParam('threadId')
  const items = groupItems(state.group, threadId)
  const threadData = state.photoViewing.threads[threadId]
  const initiator = threadData ? threadData.initiator : ''
  const sharing = threadData ? threadData.sharing : Thread.Sharing.NOT_SHARED
  const canInvite = sharing !== Thread.Sharing.NOT_SHARED
  const groupName = threadData ? threadData.name : 'Unknown'
  const selfAddress = accountSelectors.getAddress(state.account) || ''
  const renaming = Object.keys(state.group.renameGroup).indexOf(threadId) > -1
  const liking = Object.keys(state.ui.likingPhotos)
  const removing = Object.keys(state.group.ignore)
  return {
    items,
    groupName,
    initiator,
    selfAddress,
    renaming,
    canInvite,
    liking,
    removing
  }
}

const mapDispatchToProps = (
  dispatch: Dispatch<RootAction>,
  ownProps: NavigationScreenProps<NavProps>
): DispatchProps => {
  const threadId = ownProps.navigation.getParam('threadId')
  return {
    refresh: () =>
      dispatch(groupActions.feed.refreshFeed.request({ id: threadId })),
    sendMessage: (message: string) =>
      dispatch(
        groupActions.addMessage.addMessage.request({
          id: uuid(),
          groupId: threadId,
          body: message
        })
      ),
    // TODO: look at just doing direct navigation for this
    showWalletPicker: () => {
      dispatch(UIActions.showWalletPicker(threadId))
    },
    addPhotoLike: (block: string) =>
      dispatch(UIActions.addLike.request({ blockId: block })),
    navigateToComments: (id: string) =>
      dispatch(UIActions.navigateToCommentsRequest(id, threadId)),
    leaveThread: () =>
      dispatch(PhotoViewingActions.removeThreadRequest(threadId)),
    retryShare: (key: string) => {
      dispatch(groupActions.addPhoto.retry(key))
    },
    cancelShare: (key: string) => {
      dispatch(groupActions.addPhoto.cancelRequest(key))
    },
    remove: (blockId: string) => {
      dispatch(groupActions.ignore.ignore.request(blockId))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Group)
