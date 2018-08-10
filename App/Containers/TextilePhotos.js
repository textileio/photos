import React from 'react'
import {View, Text, Image, TouchableWithoutFeedback, TouchableOpacity} from 'react-native'
import PhotoGrid from '../Components/PhotoGrid'
import { connect } from 'react-redux'
import PreferencesActions from '../Redux/PreferencesRedux'
import TextileNodeActions, { ThreadData, PhotosQueryResult } from '../Redux/TextileNodeRedux'
import UIActions from '../Redux/UIRedux'
import ThreadsActions from '../Redux/ThreadsRedux'
import style from './Styles/TextilePhotosStyle'
import navStyles from '../Navigation/Styles/NavigationStyles'
import Avatar from '../Components/Avatar'

class TextilePhotos extends React.PureComponent {
  constructor (props) {
    super(props)
  }

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    const avatarUrl = params.profile && params.profile.avatar_id ? 'https://cafe.us-east-1.textile.io' + params.profile.avatar_id : undefined
    const username = params.profile && params.profile.username ? params.profile.username : undefined
    const headerLeft = (
      <TouchableOpacity
        delayLongPress={3000}
        onLongPress={params.toggleVerboseUi}
        onPress={() => {
          navigation.navigate('Account', {avatarUrl, username})
        }}
      >
        <Avatar width={24} height={24} uri={avatarUrl} defaultSource={require('../SB/views/Settings/statics/main-image.png')} />
      </TouchableOpacity>
    )
    const headerRight =(
      <TouchableOpacity onPress={ () => {
        params.toggleGridView()
      }}>
        {params.gridView && <Image style={navStyles.headerIconList} source={require('../SB/views/WalletList/statics/icon-list.png')} />}
        {!params.gridView && <Image style={navStyles.headerIconList} source={require('../SB/views/WalletList/statics/icon-grid.png')} />}
      </TouchableOpacity>
      )

    const greeting = username ? 'Hello, ' + params.profile.username : 'Hi there!'
    const headerTitle = (
      <Text style={navStyles.headerTitle}>{greeting}</Text>
    )

    return {
      // TODO: headerTitle should exist a row below the nav buttons, need to figure out
      headerTitle,
      // TODO: no current menu needed for Wallet view
      headerRight,
      headerLeft,
      tabBarVisible: true
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.toggleVerboseUi !== prevProps.toggleVerboseUi ||
      this.props.profile !== prevProps.profile ||
      this.props.gridView !== prevProps.gridView
    ) {
      this.props.navigation.setParams({
        profile: this.props.profile,
        toggleVerboseUi: this.props.toggleVerboseUi,
        threadName: this.props.threadName,
        gridView: this.props.gridView,
        toggleGridView: this._toggleGridView.bind(this)
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
      gridView: this.props.gridView,
      toggleGridView: this._toggleGridView.bind(this)
    })
  }

  _toggleGridView () {
    const newValue = this.props.gridView ? 'list' : 'grid'
    this.props.toggleGridView(newValue)
  }

  onSelect = (row) => {
    return () => {
      this.props.viewPhoto(row.item.photo.id, this.props.threadId)
    }
  }

  onRefresh () {
    this.props.refresh(this.props.threadId)
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
          gridView={this.props.gridView}
        />

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
    const threadData: ThreadData = state.textileNode.threads[threadId] || { querying: false, items: [] }
    items = threadData.items
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
    profile: state.preferences.profile,
    gridView: state.preferences.uiSettings.walletLayout && state.preferences.uiSettings.walletLayout === 'grid'
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dismissPhoto: () => { dispatch(UIActions.dismissViewedPhoto()) },
    viewPhoto: (photoId, threadId) => { dispatch(UIActions.viewPhotoRequest(photoId, threadId)) },
    refresh: (threadId: string) => { dispatch(TextileNodeActions.getPhotoHashesRequest(threadId)) },
    toggleGridView: (value) => { dispatch(PreferencesActions.updateSetting('walletLayout', value)) },
    toggleVerboseUi: () => { dispatch(PreferencesActions.toggleVerboseUi()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TextilePhotos)
