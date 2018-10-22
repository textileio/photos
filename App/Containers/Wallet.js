import React from 'react'
import { View, Text, Image } from 'react-native'
import PhotoGrid from '../Components/PhotoGrid'
import { connect } from 'react-redux'
import Config from 'react-native-config'
import SwitchSelector from 'react-native-switch-selector'
import PreferencesActions from '../Redux/PreferencesRedux'
import TextileNodeActions from '../Redux/TextileNodeRedux'
import StorageActions from '../Redux/StorageRedux'
import PhotoViewingActions from '../Redux/PhotoViewingRedux'
import { IPhotoGridType, Photo } from '../Models/TextileTypes'
import style from './Styles/TextilePhotosStyle'
import { TextileHeaderButtons } from '../Components/HeaderButtons'
import { Item } from 'react-navigation-header-buttons'
import WalletHeader from '../Components/WalletHeader'
import ThreadSelector from '../Components/ThreadSelector'
import { defaultThreadData, getThreads } from '../Redux/PhotoViewingSelectors'

import Button from '../SB/components/Button'
import onboardingStyles from './Styles/OnboardingStyle'
import { RootState } from '../Redux/Types'

class Wallet extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}

    const headerRight = (
      <TextileHeaderButtons>
        <Item title='Settings' iconName='cog' onPress={params.updateSettings}/>
      </TextileHeaderButtons>
    )

    return {
      // TODO: headerTitle should exist a row below the nav buttons, need to figure out
      headerRight,
      tabBarVisible: true,
      headerStyle: style.navHeader
    }
  }

  componentDidUpdate (prevProps, prevState, snapshot) {
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
    // Set params
    this.props.navigation.setParams({
      username: this.props.username,
      toggleVerboseUi: this.props.toggleVerboseUi,
      updateSettings: this.updateSettings()
    })
  }

  updateSettings () {
    return () => {
      this.props.navigation.navigate('Account', { avatarUrl: this.props.avatarUrl, username: this.props.username })
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
          selectedTab={this.props.selectedTab}
          username={this.props.profile.username}
        />
        <View style={style.gridContainer}>
          {this.props.selectedTab === 'Threads' && <ThreadSelector threads={this.props.threads} createThread={this._createThread}/>}
          {this.props.selectedTab === 'Photos' && <PhotoGrid
            items={this.props.items}
            onSelect={this.onSelect}
            onRefresh={this.onRefresh.bind(this)}
            refreshing={false}
            placeholderText={this.props.placeholderText}
            displayImages={this.props.displayImages}
            verboseUi={this.props.verboseUi}
          />}
        </View>
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
  if (allThreads.length > 0) {
    threads = allThreads
      .filter(thread => thread.name !== 'default')
      .map(thread => {
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

  const profile = state.preferences.profile

  return {
    threadId,
    threads,
    photos,
    items,
    displayImages: state.textileNode.nodeState.state === 'started',
    placeholderText,
    verboseUi: state.preferences.verboseUi,
    profile,
    showTourScreen: state.preferences.tourScreens.wallet,
    avatarUrl: profile && profile.avatar_id ? Config.TEXTILE_CAFE_URI + profile.avatar_id : undefined,
    username: profile && profile.username ? profile.username : undefined,
    selectedTab: state.preferences.viewSettings.selectedWalletTab
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    viewWalletPhoto: (photoId) => { dispatch(PhotoViewingActions.viewWalletPhoto(photoId)) },
    refresh: () => { dispatch(StorageActions.refreshLocalImagesRequest()) },
    completeTourScreen: () => { dispatch(PreferencesActions.completeTourSuccess('wallet')) },
    toggleTab: (value) => { dispatch(PreferencesActions.updateViewSetting('selectedWalletTab', value)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Wallet)
