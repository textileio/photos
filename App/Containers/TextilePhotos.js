import React from 'react'
import {View, Text, Image } from 'react-native'
import HeaderButtons, { Item } from 'react-navigation-header-buttons'
import PhotoGrid from '../Components/PhotoGrid'
import { connect } from 'react-redux'
import Config from 'react-native-config'
import PreferencesActions from '../Redux/PreferencesRedux'
import TextileNodeActions, { ThreadData } from '../Redux/TextileNodeRedux'
import { ThreadName, Photo } from '../Models/TextileTypes'
import UIActions from '../Redux/UIRedux'
import style from './Styles/TextilePhotosStyle'
import navStyles from '../Navigation/Styles/NavigationStyles'
import Avatar from '../Components/Avatar'

import Button from '../SB/components/Button'
import styles from '../SB/views/ThreadsList/statics/styles'

class TextilePhotos extends React.PureComponent {
  componentDidMount () {
    // Unload any full screen photo
    // Needed to move here because the Navbar in PhotoDetail couldn't UIAction dispatch
    this.props.dismissPhoto()
  }

  onSelect = (row) => {
    return () => {
      this.props.viewPhoto(row.item.id, this.props.threadId)
    }
  }

  onRefresh () {
    this.props.refresh(this.props.threadId)
  }

  render () {
    return (
      <View style={style.container}>
        {this.props.showTourScreen && (
          <View style={styles.emptyStateContainer}>
            <Image
              style={styles.emptyStateImage}
              source={require('../Images/v2/permissions.png')} />
            <Text style={styles.emptyStateText}>
              This is the Textile wallet, a private
              space where you can manage the data
              you create while using the app.
            </Text>
            <Button primary text='See your wallet' onPress={() => {
              this.props.completeTourScreen()
            }} />
          </View>
        )}
        {!this.props.showTourScreen && (
        <PhotoGrid
          photos={this.props.photos}
          progressData={this.props.progressData}
          onSelect={this.onSelect}
          onRefresh={this.onRefresh.bind(this)}
          refreshing={this.props.refreshing}
          placeholderText={this.props.placeholderText}
          displayImages={this.props.displayImages}
          verboseUi={this.props.verboseUi}
        />
        )}
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

  const threadName: ThreadName = 'default'
  const defaultThread = state.threads.threads.find(thread => thread.name === threadName)
  const defaultThreadId = defaultThread ? defaultThread.id : undefined

  const threadId = navParams.id || defaultThreadId

  var photos: Photo[] = []
  var refreshing = false
  if (threadId) {
    const threadData: ThreadData = state.textileNode.threads[threadId] || { querying: false, items: [] }
    photos = threadData.photos
    refreshing = threadData.querying
  }

  const nodeStatus = state.textileNode.nodeState.error
    ? 'Error - ' + state.textileNode.nodeState.error.message
    : state.textileNode.nodeState.state

  const queryingCameraRollStatus = state.cameraRoll.querying ? 'querying' : 'idle'

  const placeholderText = state.textileNode.nodeState.state !== 'started'
    ? 'Wallet Status:\n' + nodeStatus
    : 'Any new photos you take will be added to your Textile wallet.'

  return {
    threadId,
    threadName,
    photos,
    progressData: state.uploadingImages.images,
    refreshing,
    displayImages: state.textileNode.nodeState.state === 'started',
    placeholderText,
    nodeStatus,
    queryingCameraRollStatus,
    verboseUi: state.preferences.verboseUi,
    profile: state.preferences.profile,
    showTourScreen: state.preferences.tourScreens.wallet
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dismissPhoto: () => { dispatch(UIActions.dismissViewedPhoto()) },
    viewPhoto: (photoId, threadId) => { dispatch(UIActions.viewPhotoRequest(photoId, threadId)) },
    refresh: (threadId: string) => { dispatch(TextileNodeActions.getPhotoHashesRequest(threadId)) },
    toggleVerboseUi: () => { dispatch(PreferencesActions.toggleVerboseUi()) },
    completeTourScreen: () => { dispatch(PreferencesActions.completeTourSuccess('wallet')) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TextilePhotos)
