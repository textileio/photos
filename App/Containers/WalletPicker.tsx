import React from 'react'
import { View, Text } from 'react-native'
import { TextileHeaderButtons, Item } from '../Components/HeaderButtons'
import PhotoGrid from '../Components/PhotoGrid'
import { connect } from 'react-redux'
import PreferencesActions from '../Redux/PreferencesRedux'
import GroupsActions from '../Redux/GroupsRedux'
import UIActions from '../Redux/UIRedux'
import style from './Styles/TextilePhotosStyle'
import { NavigationActions, NavigationScreenProps } from 'react-navigation'
import {
  defaultThreadData
} from '../Redux/GroupsSelectors'
import {
  getSharedPhotos,
  SharedPhoto
} from '../Redux/PhotoViewingSelectors'
import { TextileEventsSelectors } from '../Redux/TextileEventsRedux'
import { RootState, RootAction } from '../Redux/Types'
import { Dispatch } from 'redux'
import { IFiles } from '@textile/react-native-sdk'

interface NavProps {
  cancelSharingPhoto: () => void
  showImagePicker: (type: string) => void
}

type Props = StateProps & DispatchProps & NavigationScreenProps<NavProps>

class TextileWalletPicker extends React.PureComponent<Props> {
  static navigationOptions = ({
    navigation
  }: NavigationScreenProps<NavProps>) => {
    const cancelSharingPhoto = navigation.getParam('cancelSharingPhoto')
    const showImagePicker = navigation.getParam('showImagePicker')

    const cameraRoll = () => {
      showImagePicker('camera-roll')
    }
    const camera = () => {
      showImagePicker('camera')
    }
    const onPress = () => {
      cancelSharingPhoto()
      navigation.dispatch(NavigationActions.back())
    }

    const headerLeft = (
      <TextileHeaderButtons left={true}>
        <Item title="Back" iconName="arrow-left" onPress={onPress} />
      </TextileHeaderButtons>
    )
    const headerTitle = 'Recent Photos'
    const headerRight = (
      <TextileHeaderButtons>
        <Item title="camera" iconName="camera-create" onPress={camera} />
        <Item title="camera roll" iconName="image" onPress={cameraRoll} />
      </TextileHeaderButtons>
    )
    return {
      headerTitle,
      headerLeft,
      headerRight
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      cancelSharingPhoto: this.props.cancelSharingPhoto,
      showImagePicker: this.props.showImagePicker
    })
  }

  onSelect = (photo: IFiles) => {
    return () => {
      this.props.success(photo)
    }
  }

  onRefresh = () => {
    if (this.props.threadId) {
      this.props.refresh(this.props.threadId)
    }
  }

  render() {
    return (
      <View style={style.container}>
        <PhotoGrid
          items={this.props.items}
          onSelect={this.onSelect}
          onRefresh={this.onRefresh}
          refreshing={this.props.refreshing}
          placeholderText={this.props.placeholderText}
          displayImages={this.props.displayImages}
          verboseUi={this.props.verboseUi}
        />
      </View>
    )
  }
}

interface StateProps {
  threadId?: string
  items: SharedPhoto[]
  refreshing: boolean
  displayImages: boolean
  placeholderText: string
  verboseUi: boolean
}

const mapStateToProps = (state: RootState): StateProps => {
  const defaultData = defaultThreadData(state)
  const threadId = defaultData ? defaultData.id : undefined
  const items = getSharedPhotos(state, 'date')

  const refreshing = defaultData ? defaultData.querying : false

  const started = TextileEventsSelectors.started(state)

  const nodeStatus = state.textile.nodeState.error
    ? 'Error - ' + state.textile.nodeState.error
    : state.textile.nodeState.state

  const placeholderText = !started
    ? 'Wallet Status:\n' + nodeStatus
    : 'You need to add some photos first.'

  return {
    threadId,
    items,
    refreshing,
    displayImages: started,
    placeholderText,
    verboseUi: state.preferences.verboseUi
  }
}

interface DispatchProps {
  success: (photo: IFiles) => void
  cancelSharingPhoto: () => void
  refresh: (threadId: string) => void
  showImagePicker: (type: string) => void
  toggleVerboseUi: () => void
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => ({
  success: photo => {
    dispatch(UIActions.walletPickerSuccess(photo))
  },
  cancelSharingPhoto: () => {
    dispatch(UIActions.cancelSharingPhoto())
  },
  refresh: threadId => {
    dispatch(GroupsActions.refreshThreadRequest(threadId))
  },
  showImagePicker: type => {
    dispatch(UIActions.showImagePicker(type))
  },
  toggleVerboseUi: () => {
    dispatch(PreferencesActions.toggleVerboseUi())
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TextileWalletPicker)
