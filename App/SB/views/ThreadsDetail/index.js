import React from 'react'
import { connect } from 'react-redux'
import {View, Text, Image, TouchableOpacity, ScrollView } from 'react-native'

import ThreadDetailCard from '../../components/ThreadDetailCard'
import BottomDrawerList from '../../components/BottomDrawerList'

import styles from './statics/styles'
import list from './constants'
import UIActions from '../../../Redux/UIRedux'
import TextileNodeActions, { PhotosQueryResult, ThreadData } from '../../../Redux/TextileNodeRedux'
import PreferencesActions from '../../../Redux/PreferencesRedux'
import ThreadsActions from '../../../Redux/ThreadsRedux'
import navStyles from '../../../Navigation/Styles/NavigationStyles'
import ActionSheet from 'react-native-actionsheet'

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

    const headerTitle = (
      <Text style={navStyles.headerTitle}>{params.threadName}</Text>
    )

    return {
      // TODO: headerTitle should exist a row below the nav buttons, need to figure out
      headerTitle,
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
      this.props.navigation.setParams({
        profile: this.props.profile,
        toggleVerboseUi: this.props.toggleVerboseUi,
        threadName: this.props.threadName,
        showActionSheet: this.showActionSheet.bind(this),
        showImagePicker: this.showImagePicker.bind(this)
      })
    }
  }

  componentDidMount () {
    // Unload any full screen photo
    // Needed to move here because the Navbar in PhotoDetail couldn't UIAction dispatch
    this.props.dismissPhoto()
    // Set params
    this.props.navigation.setParams({
      profile: this.props.profile,
      toggleVerboseUi: this.props.toggleVerboseUi,
      threadName: this.props.threadName,
      showActionSheet: this.showActionSheet.bind(this),
      showImagePicker: this.showImagePicker.bind(this)
    })
  }

  showActionSheet () {
    this.actionSheet.show()
  }

  showImagePicker () {
    this.props.showImagePicker(this.props.threadId)
  }

  handleActionSheetResponse (index: number) {
    if (index === 0) {
      this.props.invite(this.props.threadId, this.props.threadName)
    } else if (index === 1) {
      this.props.leaveThread(this.props.threadId)
    }
  }

  onPhotoSelect = () => {
    return (photoId) => {
      this.props.viewPhoto(photoId, this.props.threadId)
    }
  }

  render () {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.contentContainer}>
          {this.props.items.map((item, i) => <ThreadDetailCard key={i} last={i === this.props.items.length - 1} {...item} onSelect={this.onPhotoSelect()}/>)}
        </ScrollView>

        {this.state.showDrawer && <BottomDrawerList/>}

        <ActionSheet
          ref={o => this.actionSheet = o}
          title={this.props.threadName + ' options'}
          options={['Invite Others', 'Leave Thread', 'Cancel']}
          cancelButtonIndex={2}
          onPress={this.handleActionSheetResponse.bind(this)}
        />
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

  return {
    threadId,
    threadName,
    items,
    progressData: state.uploadingImages.images,
    refreshing,
    displayImages: state.textileNode.nodeState.state === 'started',
    placeholderText,
    nodeStatus,
    queryingCameraRollStatus,
    verboseUi: state.preferences.verboseUi,
    profile: state.preferences.profile
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
    leaveThread: (threadId: string) => { dispatch(ThreadsActions.removeThreadRequest(threadId)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreadsEdit)
