import React from 'react'
import {View, Text, Image, TouchableWithoutFeedback, TouchableOpacity} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import HeaderButtons from 'react-navigation-header-buttons'
import { NavigationActions } from 'react-navigation'
import ActionSheet from 'react-native-actionsheet'
import PhotoGrid from '../Components/PhotoGrid'
import { connect } from 'react-redux'
import PreferencesActions from '../Redux/PreferencesRedux'
import TextileNodeActions, { ThreadData, PhotosQueryResult } from '../Redux/TextileNodeRedux'
import UIActions from '../Redux/UIRedux'
import ThreadsActions from '../Redux/ThreadsRedux'
import style from './Styles/TextilePhotosStyle'
import navStyles from '../Navigation/Styles/NavigationStyles'
import TextileImage from '../../TextileImage'

import BottomDrawerList from '../SB/components/BottomDrawerList'

class TextilePhotos extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      showDrawer: false
    }
  }

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    const headerLeft = params.threadName === 'default' ? (
      <TouchableWithoutFeedback delayLongPress={3000} onLongPress={params.toggleVerboseUi}>
        <View style={navStyles.headerIconUser}>
          <View style={navStyles.iconContainer}>
            {(params.profile && params.profile.avatar_id) && <TextileImage
              imageId={params.profile.avatar_id}
              path={'thumb'}
              resizeMode={'cover'}
              height={24}
              width={24}
            />}
          </View>
        </View>
      </TouchableWithoutFeedback>
    ) : (
      <TouchableOpacity onPress={ () => {
        navigation.goBack(null)
      }}>
        <Image
          style={navStyles.headerLeft}
          source={require('../SB/views/ThreadsDetail/statics/icon-arrow-left.png')}
        />
      </TouchableOpacity>
    )
    const headerRight = params.threadName === 'default' ? (
      <TouchableOpacity onPress={ () => {
        console.log('TODO: HANDLE MENU CLICK FROM WALLET')
      }}>
        <Image style={navStyles.headerIconList} source={require('../SB/views/WalletList/statics/icon-list.png')} />
      </TouchableOpacity>
    ) : (
      <View style={navStyles.headerRight}>
        <TouchableOpacity onPress={ () => {
          console.log('TODO: HANDLE CLICKED PHOTO ADD FROM SHARED THREAD')
        }}>
          <Image
            style={navStyles.headerIconPhoto}
            source={require('../SB/views/ThreadsDetail/statics/icon-photo.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={params.showActionSheet}>
          <Image
            style={navStyles.headerIconMore}
            source={require('../SB/views/ThreadsDetail/statics/icon-more.png')}
          />
        </TouchableOpacity>
      </View>
    )

    const greeting = params.profile && params.profile.username ? 'Hello, ' + params.profile.username : 'Hi there!'
    const headerText = params.threadName === 'default' ? greeting : params.threadName
    const headerTitle = (
      <Text style={navStyles.headerTitle}>{headerText}</Text>
    )

    return {
      // TODO: headerTitle should exist a row below the nav buttons, need to figure out
      headerTitle,
      // TODO: no current menu needed for Wallet view
      headerRight,
      headerLeft,
      tabBarVisible: params.threadName === 'default'
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
        showActionSheet: this.showActionSheet.bind(this)
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
      showActionSheet: this.showActionSheet.bind(this)
    })
  }

  onSelect = (row) => {
    return () => {
      console.log(row)
      this.props.viewPhoto(row.item.photo.id, this.props.threadId)
    }
  }

  onRefresh () {
    this.props.refresh(this.props.threadId)
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

  render () {
    return (
      <View style={style.container}>
        <PhotoGrid
          items={this.props.items}
          progressData={this.props.progressData}
          onSelect={this.onSelect}
          onRefresh={this.onRefresh.bind(this)}
          refreshing={this.props.refreshing}
          placeholderText={this.props.placeholderText}
          displayImages={this.props.displayImages}
          verboseUi={this.props.verboseUi}
        />
        <ActionSheet
          ref={o => this.actionSheet = o}
          title={this.props.threadName + ' options'}
          options={['Invite Others', 'Leave Thread', 'Cancel']}
          cancelButtonIndex={2}
          onPress={this.handleActionSheetResponse.bind(this)}
        />

        { this.state.showDrawer && <BottomDrawerList /> }

        {this.props.verboseUi &&
          <View style={style.bottomOverlay} >
            <Text style={style.overlayText}>{this.props.nodeStatus + ' | ' + this.props.queryingCameraRollStatus}</Text>
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

  var items: PhotosQueryResult[] = []
  var refreshing = false
  var thread = undefined
  if (threadId) {
    const threadData: ThreadData = state.ipfs.threads[threadId] || { querying: false, items: [] }
    items = threadData.items
    refreshing = threadData.querying
    thread = state.threads.threads.find(thread => thread.id === threadId)
  }

  // I saw a really weird state where thread was all undefined....
  // seems like we should show a loading state if that ever happens.
  // at the very least i put the user on the default screen instead of a
  // blank Thread screen
  const threadName = thread ? thread.name : undefined

  const nodeStatus = state.ipfs.nodeState.error
    ? 'Error - ' + state.ipfs.nodeState.error.message
    : state.ipfs.nodeState.state

  const queryingCameraRollStatus = state.cameraRoll.querying ? 'querying' : 'idle'

  const placeholderText = state.ipfs.nodeState.state !== 'started'
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
    displayImages: state.ipfs.nodeState.state === 'started',
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
    refresh: (threadId: string) => { dispatch(TextileNodeActions.getPhotoHashesRequest(threadId)) },
    toggleVerboseUi: () => { dispatch(PreferencesActions.toggleVerboseUi()) },
    invite: (threadId: string, threadName: string) => { dispatch(ThreadsActions.addExternalInviteRequest(threadId, threadName)) },
    leaveThread: (threadId: string) => { dispatch(ThreadsActions.removeThreadRequest(threadId)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TextilePhotos)
