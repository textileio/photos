import React from 'react'
import { Dispatch } from 'redux'
import { connect } from 'react-redux'
import { RootState, RootAction } from '../Redux/Types'
import { Platform, Keyboard } from 'react-native'
import uuid from 'uuid/v4'

// @ts-ignore
import {
  KeyboardRegistry,
  KeyboardAccessoryView,
  KeyboardUtils
} from 'react-native-keyboard-input'
import AuthoringInput from './authoring-input'
import { SharedImage } from '../features/group/add-photo/models'
import UIActions, { SharingPhoto } from '../Redux/UIRedux'
import { groupActions } from '../features/group'
import { IFiles } from '@textile/react-native-sdk'
import { getSharedPhotos, SharedPhoto } from '../Redux/PhotoViewingSelectors'
import HorizontalGrid, { GalleryDoubles } from './HorizontalGrid'

interface ScreenProps {
  threadId: string
}
interface StateProps {
  items: SharedPhoto[]
  sharingImage?: SharedImage
  sharingFiles?: IFiles
  photoPairs: GalleryDoubles[]
  selected?: SharingPhoto
}
interface DispatchProps {
  sendMessage: (message: string) => void
  cancelSharingPhoto: () => void
  sharePhoto: (threadId: string, comment?: string) => void
  updateImages: () => void
  showImagePicker: (type: string) => void
  selectPhoto: (photo: IFiles) => void
  deselectPhoto: () => void
  updateSharingPhotoThread: () => void
}

interface GalleryProps {
  threadId: string
  photoPairs: GalleryDoubles[]
  selected?: SharingPhoto
}

const IsIOS = Platform.OS === 'ios'

type Props = ScreenProps & StateProps & DispatchProps

interface State {
  customKeyboard?: {
    component?: string
    initialProps?: GalleryProps
  }
  keyboardAccessoryViewHeight?: number
}
class PhotosKeyboard extends React.PureComponent<Props, State> {
  textInput?: AuthoringInput = undefined
  constructor(props: Props) {
    super(props)
    this.state = {
      customKeyboard: undefined
    }
  }
  componentDidMount() {
    this.props.updateImages()
  }
  resetKeyboardView = () => {
    this.setState({ customKeyboard: undefined })
  }
  galleryDismiss = () => {
    if (
      this.state.customKeyboard &&
      this.state.customKeyboard.component === 'PhotosKeyboardGrid'
    ) {
      // react-native-keyboard doesn't dismiss like a normal one, so first flip to keyboard
      this.resetKeyboardView()
      KeyboardRegistry.toggleExpandedKeyboard('PhotosKeyboardGrid')
    }
  }
  keyboardDismiss = () => {
    if (!this.state.customKeyboard || !this.state.customKeyboard.component) {
      KeyboardUtils.dismiss()
    } else {
      // keyboard dismiss from custom keyboard leaves a blank space under input...
      this.switchToKeyboard()
    }
  }
  switchToKeyboard = () => {
    this.galleryDismiss()
    this.focusTextInput()
  }
  focusTextInput = () => {
    if (this.textInput) {
      this.textInput.focus()
    }
  }
  showPhotoPicker = () => {
    if (
      this.state.customKeyboard &&
      this.state.customKeyboard.component === 'PhotosKeyboardGrid'
    ) {
      // don't do anything.
      return
    }
    KeyboardRegistry.toggleExpandedKeyboard('PhotosKeyboardGrid')
    this.setState({
      customKeyboard: {
        component: 'PhotosKeyboardGrid',
        initialProps: {
          threadId: this.props.threadId,
          selected: this.props.selected,
          photoPairs: this.props.photoPairs
        }
      }
    })
  }
  submit = (message?: string) => {
    if (this.props.sharingImage || this.props.sharingFiles) {
      this.props.sharePhoto(this.props.threadId, message)
    } else if (message !== undefined) {
      // Just a normal message
      this.props.sendMessage(message)
    }
    this.keyboardDismiss()
  }
  keyboardAccessoryViewContent = () => {
    return (
      <AuthoringInput
        ref={input => (this.textInput = input ? input : undefined)}
        containerStyle={{}}
        onSendMessage={this.submit}
        onSharePhoto={this.showPhotoPicker}
        sharingFiles={this.props.sharingFiles}
        sharingImage={this.props.sharingImage}
        activeGalleryButton={
          !this.state.customKeyboard ||
          this.state.customKeyboard.component === undefined
        }
        cancelShare={this.props.deselectPhoto}
      />
    )
  }
  render() {
    return (
      <KeyboardAccessoryView
        renderContent={this.keyboardAccessoryViewContent}
        onHeightChanged={
          IsIOS
            ? (height: number) =>
                this.setState({ keyboardAccessoryViewHeight: height })
            : undefined
        }
        trackInteractive={true}
        kbInputRef={this.textInput ? this.textInput.textInput : undefined}
        kbComponent={
          this.state.customKeyboard
            ? this.state.customKeyboard.component
            : undefined
        }
        kbInitialProps={
          this.state.customKeyboard
            ? this.state.customKeyboard.initialProps
            : undefined
        }
        onItemSelected={this.onKeyboardItemSelected}
        onKeyboardResigned={this.resetKeyboardView}
      />
    )
  }
  onKeyboardItemSelected = (
    keyboard: string,
    payload: { action: string; target?: string; block?: string }
  ) => {
    switch (payload.action) {
      case 'showImagePicker': {
        if (payload.target) {
          this.props.updateSharingPhotoThread()
          this.props.showImagePicker(payload.target)
        }
        return
      }
      case 'selectPhoto': {
        if (payload.block) {
          if (
            this.props.sharingFiles &&
            payload.block === this.props.sharingFiles.block
          ) {
            this.props.deselectPhoto()
            return
          }
          this.props.updateSharingPhotoThread()
          const item = this.props.items.find(
            item => item.photo.block === payload.block
          )
          if (item) {
            this.props.selectPhoto(item.photo)
          }
        }
        return
      }
      default: {
        return
      }
    }
  }
}

const mapStateToProps = (
  state: RootState,
  ownProps: ScreenProps
): StateProps => {
  const items = getSharedPhotos(state, 'date')
  const { threadId } = ownProps
  let sharingImage
  let sharingFiles
  const { sharingPhoto } = state.ui
  if (sharingPhoto && sharingPhoto.threadId === threadId) {
    sharingImage = sharingPhoto.image
    sharingFiles = sharingPhoto.files
  }

  /**
   * The HorizontalGallery needs to load with all the data sent to it (afaict)
   * so here, I'm just minimizing the amount of data passed at init.
   * This could use some testing if it adds enough benefit.
   */
  const photoPairs = []
  const its = items.map(item => {
    return { block: item.photo.block, data: item.photo.data }
  })
  while (its.length) {
    photoPairs.push(its.splice(0, 2))
  }

  return {
    items,
    sharingImage,
    sharingFiles,
    selected: sharingPhoto,
    photoPairs
  }
}

const mapDispatchToProps = (
  dispatch: Dispatch<RootAction>,
  ownProps: ScreenProps
): DispatchProps => {
  const { threadId } = ownProps
  return {
    updateImages: () => dispatch(UIActions.refreshGalleryImages(threadId)),
    sendMessage: (message: string) =>
      dispatch(
        groupActions.addMessage.addMessage.request({
          id: uuid(),
          groupId: threadId,
          body: message
        })
      ),
    cancelSharingPhoto: () => {
      dispatch(UIActions.cancelSharingPhoto())
    },
    sharePhoto: (threadId: string, comment?: string) => {
      dispatch(UIActions.initShareRequest(threadId, comment))
    },
    showImagePicker: (type: string) => {
      dispatch(UIActions.showImagePicker(type))
    },
    selectPhoto: (photo: IFiles) => {
      dispatch(UIActions.updateSharingPhotoFiles(photo))
    },
    deselectPhoto: () => {
      dispatch(UIActions.deselectSharingPhoto())
    },
    updateSharingPhotoThread: () => {
      dispatch(UIActions.updateSharingPhotoThread(threadId))
    }
  }
}

// I left this whole component in here because I had some odd behavior when
// putting it away from the KeyboardRegistry step below it.
class PhotosKeyboardGrid extends React.Component<GalleryProps> {
  showImagePicker = (target: string) => {
    // Keyboards can't speak directly back to the other components, so messages are sent this way
    KeyboardRegistry.onItemSelected('PhotosKeyboardGrid', {
      action: 'showImagePicker',
      target
    })
  }
  selectPhoto = (block: string) => {
    // Keyboards can't speak directly back to the other components, so messages are sent this way
    KeyboardRegistry.onItemSelected('PhotosKeyboardGrid', {
      action: 'selectPhoto',
      block
    })
  }

  render() {
    /**
     * Only vanilla components are allowed here, they wont have access to redux etc.
     * I did some basic tests and could make connected components work in android
     * but not ios
     */
    return (
      <HorizontalGrid
        selectPhoto={this.selectPhoto}
        showImagePicker={this.showImagePicker}
        threadId={this.props.threadId}
        selected={this.props.selected}
        photoPairs={this.props.photoPairs}
      />
    )
  }
}

KeyboardRegistry.registerKeyboard(
  'PhotosKeyboardGrid',
  () => PhotosKeyboardGrid
)

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PhotosKeyboard)
