import React from 'react'
import { View, Text, Image, TouchableOpacity } from 'react-native'
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

class Wallet extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    const greeting = params.username ? 'Hello, ' + params.username : 'Hi there!'
    const headerTitle = (
      <Text style={navStyles.headerTitle}>
        {greeting}
      </Text>
    )

    return {
      // TODO: headerTitle should exist a row below the nav buttons, need to figure out
      headerTitle,
      tabBarVisible: true,

      headerStyle: style.navHeader
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (
      this.props.toggleVerboseUi !== prevProps.toggleVerboseUi ||
      this.props.profile !== prevProps.profile
    ) {
      this.props.navigation.setParams({
        username: this.props.username,
        toggleVerboseUi: this.props.toggleVerboseUi
      })
    }
  }

  componentDidMount () {
    // Unload any full screen photo
    // Needed to move here because the Navbar in PhotoDetail couldn't UIAction dispatch
    this.props.dismissPhoto()
    // Set params
    this.props.navigation.setParams({
      username: this.props.username,
      toggleVerboseUi: this.props.toggleVerboseUi
    })
    this.props.navigation.addListener('willFocus', this._onFocus.bind(this))
  }

  componentWillUnmount () {
    // remove the listeners for enter tab
    this.props.navigation.removeListener('onFocus', this._onFocus.bind(this))
  }

  _onFocus () {
    this.props.updateOverview()
  }

  onSelect = (row) => {
    return () => {
      this.props.viewPhoto(row.item.id, this.props.threadId)
    }
  }

  onRefresh () {
    this.props.refresh(this.props.threadId)
    this.props.updateOverview()
  }

  renderTour () {
    return (
      <View style={style.container}>
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
      </View>
    )
  }

  renderWallet () {
    return (
      <View style={style.container}>
        <View style={style.walletHeader}>
          <TouchableOpacity
            style={style.walletAvatar}
            onPress={() => {
              this.props.navigation.navigate('ChangeAvatar', {avatarUrl: this.props.avatarUrl, username: this.props.username, backTo: 'Wallet'})
            }}
          >
            <Avatar
              width={96}
              height={96}
              uri={this.props.avatarUrl}
              defaultSource={require('../Images/v2/update-avatar.png')}
            />
          </TouchableOpacity>
          <View style={style.walletStats}>
            <View style={style.walletStatsTop}>
              <View
                style={style.walletStatsTopColumn}
              >
                <Text style={[style.walletStatsCount, !this.props.overview.available && style.statDim]}>
                  {this.props.overview.photoCount}
                </Text>
                <Text style={style.walletStatsTitle}>
                  {this.props.overview.photoTitle}
                </Text>
              </View>
              <View
                style={style.walletStatsTopColumn}
              >
                <Text style={[style.walletStatsCount, !this.props.overview.available && style.statDim]}>{this.props.overview.peerCount}</Text>
                <Text style={style.walletStatsTitle}>
                  {this.props.overview.peerTitle}
                </Text>
              </View>
              <TouchableOpacity
                style={style.walletStatsTopColumn}
                onPress={() => this.props.navigation.navigate('Threads')
                }
              >
                <Text style={[style.walletStatsCount, !this.props.overview.available && style.statDim]}>{this.props.overview.threadCount}</Text>
                <Text style={style.walletStatsTitle}>
                  {this.props.overview.threadTitle}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={style.walletStatsBottom}>
              <TouchableOpacity
                style={style.walletSettingsButton}
                onPress={() => {
                  this.props.navigation.navigate('Account', {avatarUrl: this.props.avatarUrl, username: this.props.username})
                }}
              >
                <Text style={style.walletSettingsText}>View Settings</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={style.gridContainer}>
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
        </View>
        {this.props.verboseUi &&
        <View style={style.bottomOverlay} >
          <Text style={style.overlayText}>{this.props.nodeStatus + ' | ' + this.props.queryingCameraRollStatus}</Text>
        </View>
        }
      </View>
    )
  }

  render () {
    if (this.props.showTourScreen) {
      return this.renderTour()
    } else {
      return this.renderWallet()
    }
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

  const overview = {
    available: !!state.textileNode.overview,
    photoCount: state.textileNode.overview ? state.textileNode.overview.photo_count : '-',
    photoTitle: !state.textileNode.overview || state.textileNode.overview.photo_count !== 1 ? 'photos' : 'photo',
    threadCount: state.textileNode.overview ? state.textileNode.overview.thread_count : '-',
    threadTitle: !state.textileNode.overview || state.textileNode.overview.thread_count !== 1 ? 'threads' : 'thread',
    peerCount: state.textileNode.overview ? state.textileNode.overview.contact_count : '-',
    peerTitle: !state.textileNode.overview || state.textileNode.overview.contact_count !== 1 ? 'peers' : 'peer'
  }
  const profile = state.preferences.profile
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
    profile,
    showTourScreen: state.preferences.tourScreens.wallet,
    avatarUrl: profile && profile.avatar_id ? Config.TEXTILE_CAFE_URI + profile.avatar_id : undefined,
    username: profile && profile.username ? profile.username : undefined,
    overview
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    dismissPhoto: () => { dispatch(UIActions.dismissViewedPhoto()) },
    viewPhoto: (photoId, threadId) => { dispatch(UIActions.viewPhotoRequest(photoId, threadId)) },
    refresh: (threadId: string) => { dispatch(TextileNodeActions.getPhotoHashesRequest(threadId)) },
    toggleVerboseUi: () => { dispatch(PreferencesActions.toggleVerboseUi()) },
    completeTourScreen: () => { dispatch(PreferencesActions.completeTourSuccess('wallet')) },
    updateOverview: () => { dispatch(TextileNodeActions.updateOverviewRequest()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Wallet)
