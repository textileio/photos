import React from 'react'
import {View, Text, Image, TouchableWithoutFeedback} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import HeaderButtons from 'react-navigation-header-buttons'
import ActionSheet from 'react-native-actionsheet'
import PhotoGrid from '../Components/PhotoGrid'
import { connect } from 'react-redux'
import PreferencesActions from '../Redux/PreferencesRedux'
import TextileNodeActions, { ThreadData } from '../Redux/TextileNodeRedux'
import UIActions from '../Redux/UIRedux'
import ThreadsActions from '../Redux/ThreadsRedux'
import style from './Styles/TextilePhotosStyle'
import navStyles from '../Navigation/Styles/NavigationStyles'
import DeepLink from '../Services/DeepLink'

class TextilePhotos extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    const headerTitle = params.threadName === 'default' ? (
      <TouchableWithoutFeedback delayLongPress={3000} onLongPress={params.toggleVerboseUi}>
        <Image style={navStyles.headerTitleImage} source={require('../Images/TextileHeader.png')} />
      </TouchableWithoutFeedback>
    ) : params.threadName
    const headerRight = params.threadName === 'default' ? null : (
      <HeaderButtons IconComponent={Icon} iconSize={33} color="white">
        <HeaderButtons.Item title="options" iconName="ios-more" onPress={params.showActionSheet} />
      </HeaderButtons>
    )
    return {
      headerTitle,
      headerRight
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.toggleVerboseUi !== prevProps.toggleVerboseUi || this.props.threadName !== prevProps.threadName) {
      this.props.navigation.setParams({
        toggleVerboseUi: this.props.toggleVerboseUi,
        threadName: this.props.threadName,
        showActionSheet: this.showActionSheet.bind(this)
      })
    }
  }

  componentDidMount () {
    this.props.navigation.setParams({
      toggleVerboseUi: this.props.toggleVerboseUi,
      threadName: this.props.threadName,
      showActionSheet: this.showActionSheet.bind(this)
    })
  }

  onSelect = (row) => {
    return () => {
      this.props.viewPhoto(row.index, this.props.threadId)
    }
  }

  onRefresh () {
    this.props.refresh(this.props.threadId)
  }

  showActionSheet() {
    this.actionSheet.show()
  }

  handleActionSheetResponse (index: number) {
    if (index === 0) {
      this.props.invite(this.props.threadId, this.props.threadName)
    } else if (index === 1) {
      this.props.leaveThread(this.props.threadId)
    }
  }

  render () {
    return (
      <View style={style.container}>
        <PhotoGrid
          items={this.props.items}
          onSelect={this.onSelect}
          onRefresh={this.onRefresh.bind(this)}
          refreshing={this.props.refreshing}
          placeholderText={this.props.placeholderText}
          displayImages={this.props.displayImages}
        />
        <ActionSheet
          ref={o => this.actionSheet = o}
          title={this.props.threadName + ' Thread Actions'}
          options={['Invite Others', 'Leave Thread', 'Cancel']}
          cancelButtonIndex={2}
          onPress={this.handleActionSheetResponse.bind(this)}
        />
        {this.props.verboseUi &&
          <View style={style.bottomOverlay} >
            <Text style={style.overlayText}>{this.props.nodeStatus}</Text>
          </View>
        }
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  // TODO: Can this be a selector?
  const navParams = ownProps.navigation.state.params || {}
  const defaultThread = state.threads.threads.find(thread => thread.name === 'default')
  const defaultThreadId = defaultThread ? defaultThread.id : undefined
  const threadId = navParams.id || defaultThreadId

  var items = []
  var refreshing = false
  var thread = undefined
  if (threadId) {
    const threadData: ThreadData = state.ipfs.threads[threadId] || { querying: false, items: [] }
    let allItemsObj = threadData.items.reduce((o, item, index) => ({...o, [item.photo.id]: { index, hash: item.photo.id, caption: item.photo.caption, state: 'complete' }}), {})
    for (const processingItem of state.textile.images.items) {
      const item = allItemsObj[processingItem.hash]
      if (item) {
        const updatedItem = { ...item, ...processingItem }
        allItemsObj[processingItem.hash] = updatedItem
      }
    }
    items = Object.values(allItemsObj).sort((a, b) => a.index > b.index)
    refreshing = threadData.querying
    thread = state.threads.threads.find(thread => thread.id === threadId)
  }

  console.log(state.threads)

  const threadName = thread ? thread.name : undefined

  const nodeStatus = state.ipfs.nodeState.error
    ? 'Error - ' + state.ipfs.nodeState.error.message
    : state.ipfs.nodeState.state

  const placeholderText = state.ipfs.nodeState.state !== 'started'
    ? 'Wallet Status:\n' + nodeStatus
    : (threadName === 'default'
    ? 'Any new photos you take will be added to your Textile wallet.'
    : 'Share your first photo to the ' + threadName + ' thread.')
  return {
    threadId,
    threadName,
    items,
    refreshing,
    displayImages: state.ipfs.nodeState.state === 'started',
    placeholderText,
    nodeStatus,
    verboseUi: state.preferences.verboseUi,
    pendingInviteLink: state.threads.pendingInviteLink
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    viewPhoto: (index, threadId) => { dispatch(UIActions.viewPhotoRequest(index, threadId)) },
    refresh: (threadId: string) => { dispatch(TextileNodeActions.getPhotoHashesRequest(threadId)) },
    toggleVerboseUi: () => { dispatch(PreferencesActions.toggleVerboseUi()) },
    invite: (threadId: string, threadName: string) => { dispatch(ThreadsActions.addExternalInviteRequest(threadId, threadName)) },
    leaveThread: (threadId: string) => { dispatch(ThreadsActions.removeThreadRequest(threadId)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TextilePhotos)
