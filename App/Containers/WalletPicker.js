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
      <Text style={navStyles.headerTitle}>Wallet Photos</Text>
    )
    const headerRight = (
      <TextileHeaderButtons>
        <Item title='camera' iconName='camera-create' onPress={() => {params.showImagePicker('camera')}} />
        <Item title='camera roll' iconName='image' onPress={() => {params.showImagePicker('camera-roll')}} />
      </TextileHeaderButtons>
    )
    return {
      headerTitle,
      headerLeft,
      headerRight
    }
  }

  componentDidMount () {
    this.props.navigation.setParams({
      cancelSharingPhoto: this.props.cancelSharingPhoto,
      showImagePicker: this.props.showImagePicker
    })
  }

  onSelect = (photo) => {
    return () => {
      this.props.success(photo.id)
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
          onSelect={this.onSelect}
          onRefresh={this.onRefresh.bind(this)}
          refreshing={this.props.refreshing}
          placeholderText={this.props.placeholderText}
          displayImages={this.props.displayImages}
          verboseUi={this.props.verboseUi}
        />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  const defaultData = defaultThreadData(state)
  const threadId = defaultData ? defaultData.id : undefined
  const items = !defaultData ? [] : defaultData.photos.map((photo) => {
    return {type: 'photo', photo, id: photo.id}
  })

  const refreshing = defaultData ? defaultData.querying : false

  const nodeStatus = state.textileNode.nodeState.error
    ? 'Error - ' + state.textileNode.nodeState.error.message
    : state.textileNode.nodeState.state

  const placeholderText = state.textileNode.nodeState.state !== 'started'
    ? 'Wallet Status:\n' + nodeStatus
    : 'You need to add some photos first.'

  return {
    threadId,
    items,
    refreshing,
    displayImages: state.textileNode.nodeState.state === 'started',
    placeholderText,
    verboseUi: state.preferences.verboseUi
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    success: (photoId) => { dispatch(UIActions.walletPickerSuccess(photoId)) },
    cancelSharingPhoto: () => { dispatch(UIActions.cancelSharingPhoto()) },
    refresh: (threadId) => { dispatch(PhotoViewingActions.refreshThreadRequest(threadId)) },
    showImagePicker: (type) => { dispatch(UIActions.showImagePicker(type)) },
    toggleVerboseUi: () => { dispatch(PreferencesActions.toggleVerboseUi()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TextileWalletPicker)
