import React from 'react'
import { View, Text, Image } from 'react-native'
import PhotoGrid from '../Components/PhotoGrid'
import { connect } from 'react-redux'
import Config from 'react-native-config'
import PreferencesActions from '../Redux/PreferencesRedux'
import TextileNodeActions from '../Redux/TextileNodeRedux'
import PhotoViewingActions from '../Redux/PhotoViewingRedux'
import { Photo } from '../Models/TextileTypes'
import style from './Styles/TextilePhotosStyle'
import WalletHeader from '../Components/WalletHeader'
import { defaultThreadData } from '../Redux/PhotoViewingSelectors'

import Button from '../SB/components/Button'
import styles from '../SB/views/ThreadsList/statics/styles'
import { RootState } from '../Redux/Types'

class Wallet extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    const headerTitle = params.username ? 'Hello, ' + params.username : 'Hi there!'

    return {
      // TODO: headerTitle should exist a row below the nav buttons, need to figure out
      headerTitle,
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
      this.props.viewWalletPhoto(row.item.id)
      this.props.navigation.navigate('PhotoViewer')
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
        <WalletHeader
          overview={this.props.overview}
          changeAvatar={() => {
            this.props.navigation.navigate('ChangeAvatar', { avatarUrl: this.props.avatarUrl, username: this.props.username, backTo: 'Wallet' })
          }}
          updateSettings={() => {
            this.props.navigation.navigate('Account', { avatarUrl: this.props.avatarUrl, username: this.props.username })
          }}
          viewThreads={() => this.props.navigation.navigate('Threads')}
        />
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

const mapStateToProps = (state: RootState) => {
  const defaultData = defaultThreadData(state)
  const threadId = defaultData ? defaultData.thread.id : undefined
  const photos: Photo[] = defaultData ? defaultData.photos : []
  const refreshing = defaultData ? defaultData.querying : false

  const nodeStatus = state.textileNode.nodeState.error
    ? 'Error - ' + state.textileNode.nodeState.error
    : state.textileNode.nodeState.state

  const placeholderText = state.textileNode.nodeState.state !== 'started'
    ? 'Wallet Status:\n' + nodeStatus
    : 'Any new photos you take will be added to your Textile wallet.'

  const overview = {
    available: !!state.textileNode.overview,
    photoCount: state.textileNode.overview ? photos.length.toString() : '-',
    photoTitle: !state.textileNode.overview || photos.length !== 1 ? 'photos' : 'photo',
    threadCount: state.textileNode.overview ? (state.textileNode.overview.thread_count - 1).toString() : '-',
    threadTitle: !state.textileNode.overview || state.textileNode.overview.thread_count - 1 !== 1 ? 'threads' : 'thread',
    peerCount: state.textileNode.overview ? state.textileNode.overview.contact_count.toString() : '-',
    peerTitle: !state.textileNode.overview || state.textileNode.overview.contact_count !== 1 ? 'peers' : 'peer'
  }
  const profile = state.preferences.profile
  return {
    threadId,
    photos,
    progressData: state.processingImages.images,
    refreshing,
    displayImages: state.textileNode.nodeState.state === 'started',
    placeholderText,
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
    viewWalletPhoto: (photoId) => { dispatch(PhotoViewingActions.viewWalletPhoto(photoId)) },
    refresh: (threadId: string) => { dispatch(PhotoViewingActions.refreshThreadRequest(threadId)) },
    completeTourScreen: () => { dispatch(PreferencesActions.completeTourSuccess('wallet')) },
    updateOverview: () => { dispatch(TextileNodeActions.updateOverviewRequest()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Wallet)
