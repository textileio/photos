import React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { Image, View } from 'react-native'
import { NavigationActions, NavigationScreenProps } from 'react-navigation'
import { IFiles, Thread } from '@textile/react-native-sdk'

import { TextileHeaderButtons, Item } from '../Components/HeaderButtons'
import CreateThreadModal from '../Components/CreateThreadModal'
import Input from '../SB/components/Input'
import styles from '../SB/views/ThreadCreate/statics/styles'
import ThreadSelect from '../SB/components/ThreadSelect'
import UIActions from '../Redux/UIRedux'
import GroupsActions from '../Redux/GroupsRedux'
import TextileImage from '../Components/TextileImage'
import { groupActions } from '../features/group'
import { SharedImage } from '../features/group/add-photo/models'
import { RootAction, RootState } from '../Redux/Types'

interface StateProps {
  image?: SharedImage
  files?: IFiles
  threadId?: string
  comment?: string
  selectedThreadId?: string
}

interface DispatchProps {
  updateComment: (text: string) => void
  cancelShare: () => void
  share: (
    threadId: string,
    comment?: string,
    image?: SharedImage,
    files?: IFiles
  ) => void
  shareNewThread: (
    imageId: string,
    threadName: string,
    comment?: string
  ) => void
}

type Props = DispatchProps & StateProps & NavigationScreenProps

class AddCaptionScreen extends React.Component<Props> {
  state = {
    showCreateGroupModal: false
  }

  static navigationOptions = ({ navigation }: NavigationScreenProps) => {
    const params = navigation.state.params || {}
    return {
      headerTitle: 'Share Photo',
      headerLeft: (
        <TextileHeaderButtons left={true}>
          <Item
            title="Back"
            iconName="arrow-left"
            /* tslint:disable-next-line */
            onPress={() => {
              params.cancelShare()
              navigation.dispatch(
                NavigationActions.navigate({ routeName: params.backTo })
              )
            }}
          />
        </TextileHeaderButtons>
      ),
      headerRight: (
        <TextileHeaderButtons>
          <Item
            color={params.disableShare ? '#99c0ef' : 'blue'}
            title="Share"
            /* tslint:disable-next-line */
            onPress={() => {
              if (params.disableShare) {
                return
              }
              if (params.withPhoto && params.withThreadName) {
                params.shareToNewThread(params.withPhoto, params.withThreadName)
                navigation.dispatch(
                  NavigationActions.navigate({ routeName: params.backTo })
                )
              } else {
                params.share()
                navigation.dispatch(
                  NavigationActions.navigate({ routeName: params.backTo })
                )
              }
            }}
          />
        </TextileHeaderButtons>
      )
    }
  }

  handleNewText = (text: string) => {
    this.props.updateComment(text)
  }

  componentWillMount() {
    // TODO: Investigate why share would ever be null? https://github.com/textileio/textile-mobile/issues/888
    this.props.navigation.setParams({
      disableShare:
        this.props.selectedThreadId === undefined || !this.props.share,
      cancelShare: () => {
        this.props.cancelShare()
      },
      share: this.share,
      shareToNewThread: this._shareToNewThread.bind(this)
    })
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.selectedThreadId !== this.props.selectedThreadId) {
      this.props.navigation.setParams({
        disableShare: this.props.selectedThreadId === undefined
      })
    }
  }

  share = () => {
    if (this.props.threadId) {
      this.props.share(
        this.props.threadId,
        this.props.comment,
        this.props.image,
        this.props.files
      )
    }
  }

  _shareToNewThread(withPhoto: IFiles, withThreadName: string) {
    if (withPhoto.block) {
      this.props.shareNewThread(
        withPhoto.block,
        withThreadName,
        this.props.comment
      )
    }
  }

  _createNewThread() {
    this.props.navigation.navigate('AddThread', {
      selectForShare: true,
      backTo: 'ThreadSharePhoto'
    })
  }

  openThreadModal() {
    return () => {
      this.setState({ showCreateGroupModal: true })
    }
  }

  cancelCreateThread() {
    return () => {
      this.setState({ showCreateGroupModal: false })
    }
  }

  completeCreateThread() {
    return () => {
      this.setState({ showCreateGroupModal: false })
    }
  }

  _renderImage() {
    const { image, files } = this.props
    if (image) {
      const sourceUri =
        image.origURL && image.origURL !== '' ? image.origURL : image.uri
      return (
        <Image
          source={{ uri: sourceUri }}
          resizeMode={'cover'}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: 70,
            height: 70
          }}
        />
      )
    } else if (files) {
      const filesList = files.files
      const fileIndex =
        filesList && filesList.length > 0 && filesList[0].index
          ? filesList[0].index
          : 0
      return (
        <TextileImage
          target={files.data}
          index={fileIndex}
          forMinWidth={70}
          resizeMode={'cover'}
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            width: 70,
            height: 70
          }}
        />
      )
    }
  }

  render() {
    return (
      <View style={styles.contentContainer}>
        <View style={styles.topRow}>
          <View style={styles.imagePreviewRow}>{this._renderImage()}</View>
          <View style={styles.commentRow}>
            <Input
              style={styles.comment}
              value={this.props.comment}
              label="Add a caption..."
              numberOfLines={10}
              multiline={true}
              /* tslint:disable-next-line */
              onChangeText={this.handleNewText.bind(this)}
            />
          </View>
        </View>
        <View style={styles.threadSelect}>
          <ThreadSelect
            /* tslint:disable-next-line */
            createNew={this.openThreadModal()}
          />
        </View>
        <CreateThreadModal
          isVisible={this.state.showCreateGroupModal}
          fullScreen={true}
          selectToShare={true}
          navigateTo={false}
          cancel={this.cancelCreateThread()}
          complete={this.completeCreateThread()}
        />
      </View>
    )
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  const sharingPhoto = state.ui.sharingPhoto || {}
  return {
    image: sharingPhoto.image,
    files: sharingPhoto.files,
    threadId: sharingPhoto.threadId,
    comment: sharingPhoto.comment,
    selectedThreadId: state.ui.sharingPhoto
      ? state.ui.sharingPhoto.threadId
      : undefined
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => {
  const threadConfig = {
    type: Thread.Type.OPEN,
    sharing: Thread.Sharing.SHARED,
    whitelist: []
  }
  return {
    updateComment: (text: string) => {
      dispatch(UIActions.updateSharingPhotoComment(text))
    },
    share: (
      threadId: string,
      comment?: string,
      image?: SharedImage,
      files?: IFiles
    ) => {
      if (image) {
        dispatch(
          groupActions.addPhoto.sharePhotoRequest(image, threadId, comment)
        )
      } else if (files) {
        dispatch(UIActions.sharePhotoRequest(files.data, threadId, comment))
      }
    },
    cancelShare: () => {
      dispatch(UIActions.cancelSharingPhoto())
    },
    shareNewThread: (imageId: string, threadName: string, comment?: string) => {
      dispatch(
        GroupsActions.addThreadRequest(
          { ...threadConfig, name: threadName },
          { sharePhoto: { imageId, comment } }
        )
      )
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddCaptionScreen)
