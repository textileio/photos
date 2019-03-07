import React, { Component } from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { Text, FlatList, ListRenderItemInfo, Dimensions } from 'react-native'
import { NavigationScreenProps, SafeAreaView } from 'react-navigation'
import uuid from 'uuid/v4'
import ActionSheet from 'react-native-actionsheet'
import { util } from '@textile/react-native-sdk'
import moment from 'moment'

import { TextileHeaderButtons, Item as TextileHeaderButtonsItem } from '../../Components/HeaderButtons'
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
  selfAddress: string
}

interface DispatchProps {
  refresh: () => void
  sendMessage: (message: string) => void
  showWalletPicker: () => void
  addPhotoLike: (block: string) => void
  navigateToComments: (photoId: string) => void
  leaveThread: () => void
}

interface NavProps {
  threadId: string,
  groupName: string
  showActionSheet: () => void
}

type Props = StateProps & DispatchProps & NavigationScreenProps<NavProps>

interface State {
  showInviteContactModal: boolean
}

class Group extends Component<Props, State> {

  static navigationOptions = ({ navigation }: NavigationScreenProps<NavProps>) => {
    // const openDrawer = navigation.getParam('openDrawer')
    // const addContact = navigation.getParam('addContact')
    const groupName = navigation.getParam('groupName')
    const showActionSheet = navigation.getParam('showActionSheet')
    const back = () => navigation.goBack()
    const headerLeft = (
      <TextileHeaderButtons left={true}>
        <TextileHeaderButtonsItem title='Back' iconName='arrow-left' onPress={back} />
      </TextileHeaderButtons>
    )
    const headerRight = (
      <TextileHeaderButtons>
        <TextileHeaderButtonsItem title='More' iconName='more-vertical' onPress={showActionSheet} />}
      </TextileHeaderButtons>
    )
    return {
      headerLeft,
      headerTitle: groupName,
      headerRight
    }
  }

  actionSheet: any

  constructor(props: Props) {
    super(props)
    this.state = {
      showInviteContactModal: false
    }
  }

  componentDidMount() {
    this.props.navigation.addListener('willFocus', this.onFocus)
    this.props.navigation.setParams({
      groupName: this.props.groupName,
      showActionSheet: this.showActionSheet
    })
  }

  render () {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardResponsiveContainer>
          <FlatList
            style={{ flex: 1, backgroundColor: color.screen_primary }}
            inverted={true}
            data={this.props.items}
            renderItem={this.renderRow}
          />
          <AuthoringInput containerStyle={{ }} onSendMessage={this.submit} onSharePhoto={this.props.showWalletPicker} />
          <InviteContactModal
            isVisible={this.state.showInviteContactModal}
            cancel={this.hideInviteModal}
            selectedThreadId={this.props.navigation.getParam('threadId')}
            selectedThreadName={this.props.groupName}
          />
          <ActionSheet
            ref={(o: any) => { this.actionSheet = o }}
            title={this.props.groupName + ' options'}
            options={['Invite Others', 'Leave Group', 'Cancel']}
            cancelButtonIndex={2}
            onPress={this.handleActionSheetResponse}
          />
        </KeyboardResponsiveContainer>
      </SafeAreaView>
    )
  }

  renderRow = ({ item }: ListRenderItemInfo<Item>) => {
    switch (item.type) {
      case 'photo': {
        const { user, caption, date, target, files, likes, comments, block } = item.data
        const hasLiked = likes.findIndex((likeInfo) => likeInfo.user.address === this.props.selfAddress) > -1
        const commentsData: ReadonlyArray<CommentData> = comments.map((comment) => {
          return {
            id: comment.id,
            username: comment.user.name || '?',
            body: comment.body
          }
        })
        return (
          <Photo
            avatar={user.avatar}
            username={user.name.length > 0 ? user.name : 'unknown'}
            message={caption.length > 0 ? caption : undefined}
            time={moment(util.timestampToDate(date)).calendar(undefined, momentSpec)}
            photoId={target}
            fileIndex={files[0].index}
            photoWidth={screenWidth}
            hasLiked={hasLiked}
            numberLikes={likes.length}
            onLike={this.onLike(block)}
            onComment={this.onComment(target)}
            comments={commentsData}
            commentsDisplayMax={5}
            onViewComments={this.onComment(target)}
          />
        )
      }
      case 'addingPhoto': {
        return (
          <ProcessingImage
            {...item.data}
          />
        )
      }
      case 'message': {
        const { user, body, date } = item.data
        return (
          <Message
            avatar={user.avatar}
            username={user.name || 'unknown'}
            message={body}
            // TODO: deal with pb Timestamp to JS Date!
            time={moment(util.timestampToDate(date)).calendar(undefined, momentSpec)}
          />
        )
      }
      case 'leave':
      case 'join': {
        const { user, date } = item.data
        const word = item.type === 'join' ? 'joined' : 'left'
        return (
          <Join
            avatar={user.avatar}
            username={user.name || 'unknown'}
            message={`${word} ${this.props.groupName}`}
            time={moment(util.timestampToDate(date)).calendar(undefined, momentSpec)}
          />
        )
      }
      default:
        return <Text>{`${item.type} - ${item.key}`}</Text>
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

  showActionSheet = () => {
    this.actionSheet.show()
  }

  handleActionSheetResponse = (index: number) => {
    if (index === 0) {
      this.showInviteModal()
    } else if (index === 1) {
      this.props.leaveThread()
    }
  }

  showInviteModal = () => {
    this.setState({ showInviteContactModal: true })
  }

  hideInviteModal = () => {
    this.setState({ showInviteContactModal: false })
  }
}

const mapStateToProps = (state: RootState, ownProps: NavigationScreenProps<NavProps>): StateProps => {
  const threadId = ownProps.navigation.getParam('threadId')
  const items = groupItems(state.group, threadId)
  const threadData = state.photoViewing.threads[threadId]
  const groupName = threadData ? threadData.name : 'Unknown'
  const selfAddress = state.account.address.value || ''
  return {
    items,
    groupName,
    selfAddress
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>, ownProps: NavigationScreenProps<NavProps>): DispatchProps => {
  const threadId = ownProps.navigation.getParam('threadId')
  return {
    refresh: () => dispatch(groupActions.feed.refreshFeed.request({ id: threadId })),
    sendMessage: (message: string) => dispatch(groupActions.addMessage.addMessage.request({ id: uuid(), groupId: threadId, body: message })),
    // TODO: look at just doing direct navigation for this
    showWalletPicker: () => { dispatch(UIActions.showWalletPicker(threadId)) },
    addPhotoLike: (block: string) => dispatch(UIActions.addLikeRequest(block)),
    navigateToComments: (id: string) => dispatch(UIActions.navigateToCommentsRequest(id, threadId)),
    leaveThread: () => dispatch(PhotoViewingActions.removeThreadRequest(threadId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Group)
