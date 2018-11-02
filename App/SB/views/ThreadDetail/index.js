import React from 'react'
import { connect } from 'react-redux'
import { Alert, View, Text, Image } from 'react-native'
import { NavigationActions } from 'react-navigation'

import { TextileHeaderButtons, Item } from '../../../Components/HeaderButtons'
import Icons from '../../../Components/Icons'

import BottomDrawerList from '../../components/BottomDrawerList'
import PhotoStream from '../../../Components/PhotoStream'

import UIActions from '../../../Redux/UIRedux'
import TextileNodeActions, { ThreadData } from '../../../Redux/TextileNodeRedux'
import PreferencesActions from '../../../Redux/PreferencesRedux'
import PhotoViewingActions from '../../../Redux/PhotoViewingRedux'
import { threadDataByThreadId } from '../../../Redux/PhotoViewingSelectors'
import ProcessingImagesActions from '../../../Redux/ProcessingImagesRedux'
import { Photo, ThreadId, ThreadName } from '../../../Models/TextileTypes'
import ActionSheet from 'react-native-actionsheet'

import AlertComponent from '../../../SB/components/Alert'

import { RootState } from '../../../Redux/Types'
import { IProcessingImageProps } from '../../../Components/ProcessingImage'

import ThreadsEditFriends from '../../views/ThreadsEditFriends'

import styles from './statics/styles'
import onboardingStyles from '../../../Containers/Styles/OnboardingStyle'

class ThreadDetail extends React.PureComponent {
  constructor (props) {
    super(props)
    this.state = {
      showDrawer: false,
      refreshing: false,
      addingPeers: false
    }
  }
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    const headerLeft = (
      <TextileHeaderButtons left>
        <Item title='Back' iconName='arrow-left' onPress={() => { navigation.dispatch(NavigationActions.back()) }} />
      </TextileHeaderButtons>
    )

    // <Item title='Add Thread' iconName='add-thread' onPress={() => { navigation.navigate('AddThread') }} />
    const headerRight = (
      <TextileHeaderButtons>
        <Item title='Add Photo' iconName='plus' onPress={params.showWalletPicker} />
        <Item title='Share' iconName='more-horizontal' onPress={params.showActionSheet} />
      </TextileHeaderButtons>
    )
    return {
      // TODO: no current menu needed for Wallet view
      headerTitle: params.threadName,
      headerRight,
      headerLeft
    }
  }

  componentDidUpdate (prevProps, prevState, snapShot) {
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

    if (
      this.props.showLocationPrompt
    ) {
      this._locationPrompt()
    }
  }

  componentWillMount () {
    // refresh our messages
    this.props.refreshMessages()
  }

  componentDidMount () {
    this._setHeaderParams()
  }

  _locationPrompt () {
    this.props.completeScreen('location')
    Alert.alert(
      'Background Location',
      'Even snappier sharing is possible. Enabling background location allows Textile '
        + 'to occasionally get woken up and check the network for photos you may have missed. '
        + 'We never collect or store your location data. Want in?',
      [
        {
          text: 'Yes please',
          onPress: () => {
            this.props.enableLocation()
          }
        },
        { text: 'Not now', style: 'cancel' }
      ],
      { cancelable: false }
    )
  }

  showActionSheet () {
    this.actionSheet.show()
  }

  cancelPeerRequest () {
    return () => {
      this.setState({addingPeers: false})
    }
  }
  handleActionSheetResponse (index) {
    if (index === 0) {
      this.props.addPeerRequest(this.props.threadId, this.props.threadName)
      this.setState({addingPeers: true})
      // this.props.invite(this.props.threadId, this.props.threadName)
    } else if (index === 1) {
      this.props.leaveThread(this.props.threadId)
    }
  }

  showWalletPicker () {
    this.props.showWalletPicker(this.props.threadId)
  }

  _setHeaderParams () {
    // Set params
    this.props.navigation.setParams({
      profile: this.props.profile,
      toggleVerboseUi: this.props.toggleVerboseUi,
      threadName: this.props.threadName,
      showActionSheet: () => {
        if (this.props.showOnboarding === true) {
          this.props.completeScreen('threadView')
        }
        this.showActionSheet()
      },
      showWalletPicker: () => {
        if (this.props.showOnboarding === true) {
          this.props.completeScreen('threadView')
        }
        this.showWalletPicker()
      }
    })
  }

  _renderOnboarding () {
    return (
      <View style={onboardingStyles.emptyStateContainer}>
        <Image
          style={onboardingStyles.emptyStateImage2}
          source={require('../../../Images/v2/invite_friends.png')} />
        <Text style={onboardingStyles.emptyStateText}>
          Time to share some photos. Anyone you invite to the Thread will be able to send photos, view other members photos, and invite new friends.
        </Text>
        <Text style={onboardingStyles.emptyStateText}>
          Click the <Icons style={{ margin: 10 }} name='plus' size={16} color='black' /> button to add your first photo.
          Or click the <Icons name='more-horizontal' size={16} color='black' /> button to start inviting friends.
        </Text>
      </View>
    )
  }

  render () {
    return (
      <View style={styles.container}>
        {this.props.items.length === 0 && this._renderOnboarding()}
        {this.props.items.length !== 0 && <PhotoStream items={this.props.items} />}
        {this.state.showDrawer && <BottomDrawerList />}

        <ActionSheet
          ref={o => { this.actionSheet = o }}
          title={this.props.threadName + ' options'}
          options={['Invite Others', 'Leave Thread', 'Cancel']}
          cancelButtonIndex={2}
          onPress={this.handleActionSheetResponse.bind(this)}
        />

        <AlertComponent display={this.props.displayError} bottom msg={'Error: ' + this.props.errorMessage} />
        <ThreadsEditFriends
          isVisible={this.state.addingPeers}
          threadName={this.props.threadName}
          threadId={this.props.threadId}
          cancel={this.cancelPeerRequest()}
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  const viewingThreadId = state.photoViewing.viewingThreadId

  let items = []
  let processingItems = []
  let threadName

  if (viewingThreadId) {
    const threadData = threadDataByThreadId(state, viewingThreadId) || { querying: false, photos: [] }
    items = threadData.photos.map((photo) => {
      const threadId = viewingThreadId
      const threadName = threadData.name
      return { type: 'photo', photo, threadId, threadName }
    })
    processingItems = state.processingImages.images
      .filter(image => image.destinationThreadId === viewingThreadId)
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
          props: {
            imageUri: image.sharedImage.origURL || image.sharedImage.uri, // TODO: Check this on Android
            progress,
            message,
            errorMessage: image.error
          }
        }
      })
    threadName = threadData.name
  }

  const displayImages = state.textileNode.nodeState.state === 'started'

  const showLocationPrompt = displayImages &&
    state.preferences.tourScreens.location &&
    // it's not already enabled...
    !state.preferences.services.backgroundLocation.status &&
    // only show the location prompt after a few photos exists in a thread
    items.length > 2 &&
    // only show location prompt if notifications are enabled
    state.preferences.services.notifications.status

  // add processing items to the beginning of the list
  items.unshift(...processingItems)

  return {
    threadId: viewingThreadId,
    threadName,
    items,
    displayImages,
    profile: state.preferences.profile,
    // Image Picker details
    errorMessage: state.ui.imagePickerError,
    displayError: state.ui.hasOwnProperty('imagePickerError') && state.ui.imagePickerError !== undefined,
    showOnboarding: state.preferences.tourScreens.threadView && items && items.length === 0,
    showLocationPrompt
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    viewPhoto: (photoId) => { dispatch(PhotoViewingActions.viewPhoto(photoId)) },
    showWalletPicker: (threadId) => { dispatch(UIActions.showWalletPicker(threadId)) },
    refreshMessages: () => { dispatch(TextileNodeActions.refreshMessagesRequest()) },
    toggleVerboseUi: () => { dispatch(PreferencesActions.toggleVerboseUi()) },
    leaveThread: (threadId) => { dispatch(PhotoViewingActions.removeThreadRequest(threadId)) },
    dismissError: () => { dispatch(UIActions.dismissImagePickerError()) },
    retryShare: (uuid) => { dispatch(ProcessingImagesActions.retry(uuid)) },
    cancelShare: (uuid) => { dispatch(ProcessingImagesActions.cancelRequest(uuid)) },
    addPeerRequest: (threadId, threadName) => { dispatch(UIActions.addFriendRequest(threadId, threadName)) },
    completeScreen: (name) => { dispatch(PreferencesActions.completeTourSuccess(name)) },
    enableLocation: () => { dispatch(PreferencesActions.toggleServicesRequest('backgroundLocation', true)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreadDetail)
