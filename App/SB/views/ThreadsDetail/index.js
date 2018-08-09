import React from 'react'
import { connect } from 'react-redux'
import {View, Text, Image, TouchableOpacity, ScrollView, RefreshControl} from 'react-native'

import ThreadDetailCard from '../../components/ThreadDetailCard'
import BottomDrawerList from '../../components/BottomDrawerList'

import styles from './statics/styles'
import UIActions from '../../../Redux/UIRedux'
import TextileNodeActions, { ThreadData } from '../../../Redux/TextileNodeRedux'
import PreferencesActions from '../../../Redux/PreferencesRedux'
import ThreadsActions from '../../../Redux/ThreadsRedux'
import navStyles from '../../../Navigation/Styles/NavigationStyles'
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
      <TouchableOpacity onPress={ () => {
        navigation.goBack(null)
      }}>
        <Image
          style={navStyles.headerLeft}
          source={require('./statics/icon-arrow-left.png')}
        />
      </TouchableOpacity>
    )
    const headerRight = (
      <View style={navStyles.headerRight}>
        <TouchableOpacity onPress={params.showImagePicker}>
        <Image
          style={navStyles.headerIconPhoto}
          source={require('./statics/icon-photo.png')}
        />
        </TouchableOpacity>
        <TouchableOpacity onPress={params.showActionSheet}>
          <Image
            style={navStyles.headerIconMore}
            source={require('./statics/icon-more.png')}
          />
        </TouchableOpacity>
      </View>
    )

    return {
      // TODO: no current menu needed for Wallet view
      headerRight,
      headerLeft,
      tabBarVisible: false
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
    this.props.refresh(this.props.threadId)
  }

  _progressStyle = (fillBar) => {
    if (fillBar) {
      return {height: 1, backgroundColor: '#2935ff', flex: this.props.progress}
    } else {
      return {height: 1, backgroundColor: 'transparent', flex: 1.0 - this.props.progress}
    }
  }

  render () {
    return (
      <View style={styles.container}>
        {this.props.showProgress && <View style={{height: 1, flexDirection: 'row', padding: 0, margin: 0}}>
          <View style={this._progressStyle(true)} />
          <View style={this._progressStyle()} />
        </View>}
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.props.refreshing}
              onRefresh={this._onRefresh}
            />}
          style={styles.threadsDetail}
        >

          <Text style={styles.toolbarTitle}>{this.props.threadName}</Text>
          {/*<View style={styles.toolbarUserContainer}>*/}
            {/*<Image style={styles.toolbarUserIcon} source={require('./statics/icon-photo1.png')} />*/}
            {/*<Image style={styles.toolbarUserIcon} source={require('./statics/icon-photo2.png')} />*/}
            {/*<Image style={styles.toolbarUserIcon} source={require('./statics/icon-photo3.png')} />*/}
            {/*<Image style={styles.toolbarUserIcon} source={require('./statics/icon-user-more.png')} />*/}
          {/*</View>*/}

          <View style={styles.imageList}>
            {this.props.items.map((item, i) => <ThreadDetailCard key={i} last={i === this.props.items.length - 1} {...item} profile={this.props.profile} contacts={this.props.contacts} onSelect={this._onPhotoSelect()}/>)}
          </View>
        </ScrollView>
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

  var items: PhotosQueryResult[] = []
  var refreshing = false
  var thread = undefined
  if (threadId) {
    const threadData: ThreadData = state.textileNode.threads[threadId] || { querying: false, items: [] }
    items = threadData.items.map((item) => {
      item.type = 'photo'
      return item
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
  console.log(state.preferences)
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
    contacts: state.contacts.profiles,
    // Image Picker details
    errorMessage: state.ui.imagePickerError,
    displayError: state.ui.imagePickerError !== undefined,
    showProgress: progress > 0,
    progress
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dismissPhoto: () => { dispatch(UIActions.dismissViewedPhoto()) },
    viewPhoto: (photoId, threadId) => { dispatch(UIActions.viewPhotoRequest(photoId, threadId)) },
    showImagePicker: (threadId) => { dispatch(UIActions.showImagePicker(threadId)) },
    refresh: (threadId: string) => { dispatch(TextileNodeActions.getPhotoHashesRequest(threadId)) },
    toggleVerboseUi: () => { dispatch(PreferencesActions.toggleVerboseUi()) },
    invite: (threadId: string, threadName: string) => { dispatch(ThreadsActions.addExternalInviteRequest(threadId, threadName)) },
    leaveThread: (threadId: string) => { dispatch(ThreadsActions.removeThreadRequest(threadId)) },
    dismissError: () => { dispatch(UIActions.dismissImagePickerError()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreadsEdit)
