import React from 'react'
import { connect } from 'react-redux'
import { View, Text, Image } from 'react-native'
import Config from 'react-native-config'
import PhotoGrid from '../Components/PhotoGrid'
import PeerGrid from '../Components/PeerGrid'
import WalletHeader from '../Components/WalletHeader'
import ThreadSelector from '../Components/ThreadSelector'
import CreateThreadModal from '../Components/CreateThreadModal'
import { TextileHeaderButtons, Item } from '../Components/HeaderButtons'
import Button from '../SB/components/Button'
import PreferencesActions from '../Redux/PreferencesRedux'
import TextileNodeActions from '../Redux/TextileNodeRedux'
import StorageActions from '../Redux/StorageRedux'
import PhotoViewingActions from '../Redux/PhotoViewingRedux'
import { defaultThreadData, getThreads } from '../Redux/PhotoViewingSelectors'
import Colors from '../Themes/Colors'

import style from './Styles/TextilePhotosStyle'
import onboardingStyles from './Styles/OnboardingStyle'

class Wallet extends React.PureComponent {

  state = {
    showCreateThreadModal: false
  }

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}

    const photoBackupEnabled = params.storage && params.storage.enablePhotoBackup.status

    const headerLeft = params.verboseUi && (
      <TextileHeaderButtons>
        <Item
          title='backup'
          iconName={photoBackupEnabled ? 'cloud-checked' : 'cloud'}
          color={photoBackupEnabled ? Colors.brandBlue : undefined}
          onPress={() => {
            params.toggleStorageOption('enableWalletBackup')
            params.toggleStorageOption('autoPinPhotos')
            params.toggleStorageOption('enablePhotoBackup')
          }}
        />
      </TextileHeaderButtons>
    )

    const headerRight = (
      <TextileHeaderButtons>
        <Item title='Settings' iconName='nut' onPress={params.updateSettings}/>
      </TextileHeaderButtons>
    )

    return {
      // TODO: headerTitle should exist a row below the nav buttons, need to figure out
      headerLeft,
      headerRight,
      tabBarVisible: true,
      headerStyle: style.navHeader
    }
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
    if (
      this.props.verboseUi !== prevProps.verboseUi ||
      this.props.profile !== prevProps.profile ||
      this.props.storage !== prevProps.storage
    ) {
      this.props.navigation.setParams({
        storage: this.props.storage,
        verboseUi: this.props.verboseUi,
        username: this.props.username
      })
    }
  }

  componentDidMount () {
    // Set params
    this.props.navigation.setParams({
      storage: this.props.storage,
      toggleStorageOption: this.props.toggleStorageRequest,
      verboseUi: this.props.verboseUi,
      username: this.props.username,
      updateSettings: this.updateSettings()
    })
    // add the listeners for enter tab
    this.props.navigation.addListener('willFocus', this.onFocus.bind(this))
  }

  componentWillUnmount () {
    // remove the listeners for enter tab
    this.props.navigation.removeListener('onFocus', this.onFocus.bind(this))
  }

  onFocus () {
    this.props.updateOverview()
  }

  updateSettings () {
    return () => {
      this.props.navigation.navigate('Account', { avatarUrl: this.props.avatarUrl, username: this.props.username })
    }
  }

  openThreadModal () {
    return () => {
      this.setState({showCreateThreadModal: true})
    }
  }

  cancelCreateThread () {
    return () => {
      this.setState({showCreateThreadModal: false})
    }
  }

  completeCreateThread () {
    return () => {
      this.setState({showCreateThreadModal: false})
    }
  }

  onSelect = (photo) => {
    return () => {
      this.props.viewWalletPhoto(photo.id)
      this.props.navigation.navigate('PrivatePhotoDetail')
    }
  }

  onRefresh () {
    this.props.refresh()
    this.props.updateOverview()
  }

  renderTour () {
    return (
      <View style={style.container}>
        <View style={onboardingStyles.emptyStateContainer}>
          <Image
            style={onboardingStyles.emptyStateImage}
            source={require('../Images/v2/permissions.png')} />
          <Text style={onboardingStyles.emptyStateText}>
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

  _createThread = () => {
    this.props.navigation.navigate('AddThread', {backTo: 'Wallet'})
  }

  renderWallet () {
    return (
      <View style={style.container}>
        <WalletHeader
          changeAvatar={() => {
            this.props.navigation.navigate('ChangeAvatar', { avatarUrl: this.props.avatarUrl, username: this.props.username, backTo: 'Wallet' })
          }}
          onToggle={(newValue) => {
            this.props.toggleTab(newValue)
          }}
          overview={this.props.overview}
          selectedTab={this.props.selectedTab}
          username={this.props.profile.username}
        />
        <View style={style.gridContainer}>
          {this.props.selectedTab === 'Threads' && <ThreadSelector threads={this.props.threads} createNewThread={this.openThreadModal()}/>}
          {this.props.selectedTab === 'Photos' && <PhotoGrid
            items={this.props.items}
            onSelect={this.onSelect}
            onRefresh={this.onRefresh.bind(this)}
            refreshing={false}
            placeholderText={this.props.placeholderText}
            displayImages={this.props.displayImages}
            verboseUi={this.props.verboseUi}
          />}
          {this.props.selectedTab === 'Peers' && <PeerGrid
            peers={this.props.peers}
          />}
        </View>
        <CreateThreadModal
          isVisible={this.state.showCreateThreadModal}
          fullScreen={false}
          selectToShare={false}
          navigateTo={true}
          cancel={this.cancelCreateThread()}
          complete={this.completeCreateThread()}
        />
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

const mapStateToProps = (state) => {
  const defaultData = defaultThreadData(state)
  const threadId = defaultData ? defaultData.id : undefined
  const photos = defaultData ? defaultData.photos : []

  const items = !defaultData ? [] : defaultData.photos.map((photo) => {
    return {type: 'photo', photo, id: photo.id}
  })

  // We only are showing wallet upload status in verbose for now
  if (state.preferences.verboseUi) {
    const processingItems = state.processingImages.images
      .filter(image => !image.destinationThreadId || image.destinationThreadId !== threadId)
      .map(image => {
        let progress = 0
        if (image.shareToThreadData) {
          progress = 1
        } else if (image.addToWalletData) {
          progress = 0.95
        } else if (image.uploadData) {
          progress = 0.1 + (image.uploadData.uploadProgress * 0.8)
        } else if (image.addData) {
          progress = 0.1
        }
        const message = image.state
        return {
          id: image.uuid,
          type: 'processingItem',
          photo: {
            imageUri: image.sharedImage.origURL || image.sharedImage.uri, // TODO: Check this on Android
            progress,
            message,
            errorMessage: image.error
          }
        }
      })

    items.unshift(...processingItems)
  }

  const nodeStatus = state.textileNode.nodeState.error
    ? 'Error - ' + state.textileNode.nodeState.error
    : state.textileNode.nodeState.state

  const placeholderText = state.textileNode.nodeState.state !== 'started'
    ? 'Wallet Status:\n' + nodeStatus
    : 'Any new photos you take will be added to your Textile wallet.'

  const allThreads = getThreads(state)
  let threads
  // tmp contact stuff
  let peers = {}
  // end
  if (allThreads.length > 0) {
    threads = allThreads
      .filter(thread => thread.name !== 'default')
      .map(thread => {
        // tmp contact stuff
        for (let photo of thread.photos) {
          if (state.preferences.profile && photo.author_id === state.preferences.profile.id) {
            continue
          }
          peers[photo.author_id] = peers[photo.author_id] ? peers[photo.author_id] : photo.username
        }
        // end
        return {
          id: thread.id,
          name: thread.name,
          // total number of images in the thread
          size: thread.photos.length,
          // just keep the top 2
          photos: thread.photos.slice(0, 3),
          // get a rough count of distinct users
          userCount: thread.photos.length > 0 ? [...new Set(thread.photos.map(photo => photo.author_id))].length : 1,
          // latest update based on the latest item
          updated: thread.photos.length > 0 && thread.photos[0].date ? Date.parse(thread.photos[0].date) : 0,
          // latest peer to push to the thread
          latestPeerId: thread.photos.length > 0 && thread.photos[0].author_id ? thread.photos[0].author_id : undefined
        }
      })
      .sort((a, b) => a.updated < b.updated)
  }

  const overview = {
    available: !!state.storage.overview,
    photoCount: state.storage.overview ? photos.length.toString() : '·',
    photoTitle: !state.storage.overview || photos.length !== 1 ? 'photos' : 'photo',
    threadCount: state.storage.overview ? (state.storage.overview.thread_count - 1).toString() : '·',
    threadTitle: !state.storage.overview || state.storage.overview.thread_count - 1 !== 1 ? 'threads' : 'thread',
    peerCount: state.storage.overview ? state.storage.overview.contact_count.toString() : '·',
    peerTitle: !state.storage.overview || state.storage.overview.contact_count !== 1 ? 'peers' : 'peer'
  }

  const profile = state.preferences.profile

  return {
    peers,
    threadId,
    threads,
    photos,
    items,
    displayImages: state.textileNode.nodeState.state === 'started',
    placeholderText,
    verboseUi: state.preferences.verboseUi,
    profile,
    showTourScreen: state.preferences.tourScreens.wallet,
    avatarUrl: profile && profile.avatar_id ? Config.RN_TEXTILE_CAFE_URI + profile.avatar_id : undefined,
    username: profile && profile.username ? profile.username : undefined,
    selectedTab: state.preferences.viewSettings.selectedWalletTab,
    storage: state.preferences.storage,
    overview
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    completeTourScreen: () => { dispatch(PreferencesActions.completeTourSuccess('wallet')) },
    refresh: () => { dispatch(StorageActions.refreshLocalImagesRequest()) },
    toggleStorageRequest: (name) => { dispatch(PreferencesActions.toggleStorageRequest(name)) },
    toggleTab: (value) => { dispatch(PreferencesActions.updateViewSetting('selectedWalletTab', value)) },
    updateOverview: () => { dispatch(TextileNodeActions.updateOverviewRequest()) },
    viewWalletPhoto: (photoId) => { dispatch(PhotoViewingActions.viewWalletPhoto(photoId)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Wallet)
