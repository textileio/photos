import React from 'react'
import { connect } from 'react-redux'
import {View, Text, ScrollView, RefreshControl, FlatList} from 'react-native'
import { NavigationActions } from 'react-navigation'

import { TextileHeaderButtons, Item } from '../../../Components/HeaderButtons'

import ThreadDetailCard from '../../components/ThreadDetailCard'
import BottomDrawerList from '../../components/BottomDrawerList'

import styles from './statics/styles'
import UIActions from '../../../Redux/UIRedux'
import { ThreadData } from '../../../Redux/TextileNodeRedux'
import PreferencesActions from '../../../Redux/PreferencesRedux'
import ThreadsActions from '../../../Redux/ThreadsRedux'
import * as TextileTypes from '../../../Models/TextileTypes'
import ActionSheet from 'react-native-actionsheet'

import Alert from '../../../SB/components/Alert'

class ThreadsEdit extends React.PureComponent {

  constructor (props) {
    super(props)
    this.state = {
      showDrawer: false
    }
  }
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    const headerLeft =  (
      <TextileHeaderButtons left>
        <Item title='Back' iconName='arrow-left' onPress={() => { navigation.dispatch(NavigationActions.back()) }} />
      </TextileHeaderButtons>
    )
    const headerRight = (
      <TextileHeaderButtons>
        <Item title='Add Photo' iconName='add-photo' onPress={params.showImagePicker} />
        <Item title='Share' iconName='more' onPress={params.showActionSheet} />
      </TextileHeaderButtons>
    )
    return {
      // TODO: no current menu needed for Wallet view
      headerRight,
      headerLeft
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.toggleVerboseUi !== prevProps.toggleVerboseUi ||
      this.props.threadName !== prevProps.threadName ||
      this.props.profile !== prevProps.profile
    ) {
      this._setHeaderParams()
    }

    if (this.props.displayError) {
      setTimeout(this.props.dismissError, 2500)
    }
  }

  componentWillMount () {
    // refresh our messages
    this.props.refreshMessages(true)
  }

  componentDidMount () {
    // Unload any full screen photo
    // Needed to move here because the Navbar in PhotoDetail couldn't UIAction dispatch
    this.props.dismissPhoto()
    this._setHeaderParams()
  }

  showActionSheet () {
    this.actionSheet.show()
  }

  handleActionSheetResponse (index: number) {
    if (index === 0) {
      this.props.invite(this.props.threadId, this.props.threadName)
    } else if (index === 1) {
      this.props.leaveThread(this.props.threadId)
    }
  }

  showImagePicker () {
    this.props.showImagePicker(this.props.threadId)
  }

  _setHeaderParams () {
    // Set params
    this.props.navigation.setParams({
      profile: this.props.profile,
      toggleVerboseUi: this.props.toggleVerboseUi,
      threadName: this.props.threadName,
      showActionSheet: this.showActionSheet.bind(this),
      showImagePicker: this.showImagePicker.bind(this)
    })
  }

  _onPhotoSelect = () => {
    return (photoId) => {
      this.props.viewPhoto(photoId, this.props.threadId)
    }
  }

  _onRefresh = () => {
    this.props.refreshMessages()
  }

  _progressStyle = (fillBar) => {
    if (fillBar) {
      return {height: 1, backgroundColor: '#2935ff', flex: this.props.progress}
    } else {
      return {height: 1, backgroundColor: 'transparent', flex: 1.0 - this.props.progress}
    }
  }

  _keyExtractor = (item, index) => item.id

  _renderItem = ({item}) => {
    return (
      <ThreadDetailCard id={item.id} last={item === this.props.items[this.props.items.length - 1]} item={item} profile={this.props.profile} contacts={this.props.contacts} onSelect={this._onPhotoSelect()} />
    )
  }

  render () {
    return (
      <View style={styles.container}>
        {this.props.showProgress && <View style={{height: 1, flexDirection: 'row', padding: 0, margin: 0}}>
          <View style={this._progressStyle(true)} />
          <View style={this._progressStyle()} />
        </View>}

        <View style={styles.threadsDetail} >
          <View style={styles.imageList}>
            <FlatList
              data={this.props.items}
              keyExtractor={this._keyExtractor.bind(this)}
              renderItem={this._renderItem.bind(this)}
            />
          </View>
        </View>
        {this.state.showDrawer && <BottomDrawerList/>}

        <ActionSheet
          ref={o => this.actionSheet = o}
          title={this.props.threadName + ' options'}
          options={['Invite Others', 'Leave Thread', 'Cancel']}
          cancelButtonIndex={2}
          onPress={this.handleActionSheetResponse.bind(this)}
        />

        <Alert display={this.props.displayError} bottom msg={'Error: ' + this.props.errorMessage} />
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

  var items: [{type: string, photo: TextileTypes.Photo}] = []
  var refreshing = false
  var thread = undefined

  if (threadId) {
    const threadData: ThreadData = state.textileNode.threads[threadId] || { querying: false, photos: [] }
    items = threadData.photos.map((photo) => {
      return {type: 'photo', photo, id: photo.id}
    })
    refreshing = threadData.querying
    thread = state.threads.threads.find(thread => thread.id === threadId)
  }

  // I saw a really weird state where thread was all undefined....
  // seems like we should show a loading state if that ever happens.
  // at the very least i put the user on the default screen instead of a
  // blank Thread screen
  const threadName = thread ? thread.name : undefined

  const nodeStatus = state.textileNode.nodeState.error
    ? 'Error - ' + state.textileNode.nodeState.error.message
    : state.textileNode.nodeState.state

  const queryingCameraRollStatus = state.cameraRoll.querying ? 'querying' : 'idle'

  const placeholderText = state.textileNode.nodeState.state !== 'started'
    ? 'Wallet Status:\n' + nodeStatus
    : (threadName === 'default'
      ? 'Any new photos you take will be added to your Textile wallet.'
      : 'Share your first photo to the ' + threadName + ' thread.')


  // A little bit of feedback for the user to show that an image is
  // processing... fills the gap before it shows up in the thread
  const pendingShares = state.cameraRoll.pendingShares[threadId] || []
  let progress = 0.0
  if (pendingShares.length > 0) {
    const firstShare = pendingShares[0]
    if (firstShare.caption) {
      progress = 0.3
      if (firstShare.addResult) {
        progress = 0.6
        if (state.uploadingImages.images[firstShare.addResult.id]) {
          progress = 0.8
        }
      }
    }
  }

  // add the title to the top of the flatlist
  items.unshift({
    type: 'title',
    name: threadName,
    id: threadName + '_title'
  })

  return {
    threadId,
    threadName,
    items,
    refreshing,
    displayImages: state.textileNode.nodeState.state === 'started',
    placeholderText,
    nodeStatus,
    queryingCameraRollStatus,
    verboseUi: state.preferences.verboseUi,
    profile: state.preferences.profile,
    profiles: state.contacts.profiles,
    contacts: state.contacts.profiles,
    // Image Picker details
    errorMessage: state.ui.imagePickerError,
    displayError: state.ui.hasOwnProperty('imagePickerError') && state.ui.imagePickerError !== undefined,
    showProgress: progress > 0,
    progress
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dismissPhoto: () => { dispatch(UIActions.dismissViewedPhoto()) },
    viewPhoto: (photoId, threadId) => { dispatch(UIActions.viewPhotoRequest(photoId, threadId)) },
    showImagePicker: (threadId) => { dispatch(UIActions.showImagePicker(threadId)) },
    refreshMessages: (hidden) => { dispatch(UIActions.refreshMessagesRequest(hidden)) },
    toggleVerboseUi: () => { dispatch(PreferencesActions.toggleVerboseUi()) },
    invite: (threadId: string, threadName: string) => { dispatch(ThreadsActions.addExternalInviteRequest(threadId, threadName)) },
    leaveThread: (threadId: string) => { dispatch(ThreadsActions.removeThreadRequest(threadId)) },
    dismissError: () => { dispatch(UIActions.dismissImagePickerError()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreadsEdit)
