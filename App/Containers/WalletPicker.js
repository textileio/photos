import React from 'react'
import { View, Text } from 'react-native'
import { TextileHeaderButtons, Item } from '../Components/HeaderButtons'
import PhotoGrid from '../Components/PhotoGrid'
import { connect } from 'react-redux'
import PreferencesActions from '../Redux/PreferencesRedux'
import PhotoViewingActions from '../Redux/PhotoViewingRedux'
import UIActions from '../Redux/UIRedux'
import style from './Styles/TextilePhotosStyle'
import navStyles from '../Navigation/Styles/NavigationStyles'
import { NavigationActions } from 'react-navigation'
import { Photo } from '../Models/TextileTypes'
import { defaultThreadData } from '../Redux/PhotoViewingSelectors'

class TextileWalletPicker extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    const headerLeft = (
      <TextileHeaderButtons left>
        <Item title='Back' iconName='arrow-left' onPress={() => {
          params.cancelSharingPhoto()
          navigation.dispatch(NavigationActions.back())
        }} />
      </TextileHeaderButtons>
    )
    const headerTitle = (
      <Text style={navStyles.headerTitle}>Choose a Photo</Text>
    )
    return {
      headerTitle,
      headerLeft
    }
  }

  componentDidUpdate (prevProps, prevState, ss) {
    if (
      this.props.toggleVerboseUi !== prevProps.toggleVerboseUi
    ) {
      this.props.navigation.setParams({
        toggleVerboseUi: this.props.toggleVerboseUi,
        threadName: this.props.threadName
      })
    }
  }

  componentDidMount () {
    this.props.navigation.setParams({
      cancelSharingPhoto: this.props.cancelSharingPhoto
    })
  }

  onSelect = (row) => {
    return () => {
      this.props.sharePhoto(row.item.id)
      this.props.navigation.navigate('ThreadSharePhoto', { backTo: 'ViewThread' })
    }
  }

  onRefresh () {
    this.props.refresh(this.props.threadId)
  }

  render () {
    return (
      <View style={style.container}>
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

        {this.props.verboseUi &&
          <View style={style.bottomOverlay} >
            <Text style={style.overlayText}>{this.props.nodeStatus + ' | ' + this.props.queryingCameraRollStatus}</Text>
          </View>
        }
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  const defaultData = defaultThreadData(state)
  const threadId = defaultData ? defaultData.thread.id : undefined
  const photos: Photo[] = defaultData ? defaultData.photos : []
  const refreshing = defaultData ? defaultData.querying : false

  const threadName = defaultData ? defaultData.thread.name : undefined

  const nodeStatus = state.textileNode.nodeState.error
    ? 'Error - ' + state.textileNode.nodeState.error.message
    : state.textileNode.nodeState.state

  const queryingCameraRollStatus = state.cameraRoll.querying ? 'querying' : 'idle'

  const placeholderText = state.textileNode.nodeState.state !== 'started'
    ? 'Wallet Status:\n' + nodeStatus
    : 'You need to add some photos first.'

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
    verboseUi: state.preferences.verboseUi
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    sharePhoto: (photoId: string) => { dispatch(UIActions.updateSharingPhotoImage(photoId)) },
    cancelSharingPhoto: () => { dispatch(UIActions.cancelSharingPhoto()) },
    refresh: (threadId: string) => { dispatch(PhotoViewingActions.refreshThreadRequest(threadId)) },
    toggleVerboseUi: () => { dispatch(PreferencesActions.toggleVerboseUi()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TextileWalletPicker)
