import React from 'react'
import { connect } from 'react-redux'
import { Image, View } from 'react-native'
import { TextileHeaderButtons, Item } from '../Components/HeaderButtons'
// @ts-ignore
import Input from '../SB/components/Input'
import {NavigationActions, NavigationScreenProps} from 'react-navigation'
// @ts-ignore
import styles from '../SB/views/ThreadCreate/statics/styles'
import ThreadSelect from '../SB/components/ThreadSelect'
import UIActions from '../Redux/UIRedux'
import PhotoViewingActions from '../Redux/PhotoViewingRedux'
// @ts-ignore
import TextileImage from '../../TextileImage'
import {Photo, PhotoId, SharedImage, ThreadId, ThreadName} from '../Models/TextileTypes'
import {RootAction, RootState} from '../Redux/Types'
import {Dispatch} from 'redux'

interface StateProps {
  image?: SharedImage | PhotoId,
  threadId?: ThreadId,
  comment?: string,
  selectedThreadId?: ThreadId
}

interface DispatchProps {
  updateComment: (text: string) => void
  cancelShare: () => void
  share: (image?: SharedImage | PhotoId, threadId?: ThreadId, comment?: string) => void
  shareNewThread: (imageId: PhotoId, threadName: string, comment?: string) => void
}

type Props = DispatchProps & StateProps & NavigationScreenProps

class AddCaptionScreen extends React.Component<Props> {
  static navigationOptions = ({navigation}: NavigationScreenProps) => {
    const params = navigation.state.params || {}
    return {
      headerTitle: 'Photo Caption',
      headerLeft: (
        <TextileHeaderButtons left={true}>
          <Item
            title='Back'
            iconName='arrow-left'
            /* tslint:disable-next-line */
            onPress={() => {
              params.cancelShare()
              navigation.dispatch(NavigationActions.navigate({ routeName: params.backTo }))
            }}
          />
        </TextileHeaderButtons>
      ),
      headerRight: (
        <TextileHeaderButtons>
          <Item
            textColor={params.disableShare ? '#99c0ef' : 'blue'}
            title='Share'
            /* tslint:disable-next-line */
            onPress={() => {
              if (params.disableShare) { return }
              if (params.withPhoto && params.withThreadName) {
                params.shareToNewThread(params.withPhoto, params.withThreadName)
                navigation.dispatch(NavigationActions.navigate({ routeName: params.backTo }))
              } else {
                params.share()
                navigation.dispatch(NavigationActions.navigate({ routeName: params.backTo }))
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

  componentWillMount () {
    this.props.navigation.setParams({
      disableShare: this.props.selectedThreadId === undefined,
      cancelShare: () => { this.props.cancelShare() },
      share: () => {
        if (typeof this.props.image === 'string') {
          this.props.share(this.props.image as PhotoId, this.props.threadId, this.props.comment)
        } else if (this.props.image) {
          this.props.share(this.props.image, this.props.threadId, this.props.comment)
        }
      },
      shareToNewThread: this._shareToNewThread.bind(this)
    })
  }
  componentDidUpdate (prevProps: Props) {
    if (prevProps.selectedThreadId !== this.props.selectedThreadId) {
      this.props.navigation.setParams({
        disableShare: this.props.selectedThreadId === undefined
      })
    }
  }

  _shareToNewThread (withPhoto: Photo, withThreadName: string) {
    this.props.shareNewThread(withPhoto.id, withThreadName, this.props.comment)
  }

  _createNewThread () {
    this.props.navigation.navigate('AddThread', {selectForShare: true, backTo: 'ThreadSharePhoto'})
  }

  _renderImage () {
    if (typeof this.props.image === 'string') {
      return (
        <TextileImage
          imageId={this.props.image}
          path={'small'}
          height={70}
          width={70}
          resizeMode={'cover'}
          style={styles.image}
        />
      )
    } else if (this.props.image) {
      const image: SharedImage = this.props.image
      const sourceUri = image.origURL
      && image.origURL !== ''
        ? image.origURL
        : image.uri
      return (
        <Image
          // @ts-ignore
          source={{ uri: sourceUri, isStatic: true }}
          resizeMode={'cover'}
          style={styles.image}
        />
      )
    }
  }

  render () {
    return (
      <View style={styles.contentContainer}>
        <View style={styles.topRow}>
          <View style={styles.imagePreviewRow}>
            {this._renderImage()}
          </View>
          <View style={styles.commentRow}>
            <Input
              style={styles.comment}
              value={this.props.comment}
              label='Add a caption...'
              numberOfLines={10}
              multiline={true}
              /* tslint:disable-next-line */
              onChangeText={this.handleNewText.bind(this)}
            />
          </View>
        </View>
        <ThreadSelect
          /* tslint:disable-next-line */
          createNew={this._createNewThread.bind(this)}
        />
      </View>
    )
  }
}

const mapStateToProps = (state: RootState): StateProps => {
  const sharingPhoto = state.ui.sharingPhoto || {}
  return {
    image: sharingPhoto.image,
    threadId: sharingPhoto.threadId,
    comment: sharingPhoto.comment,
    selectedThreadId: state.ui.sharingPhoto ? state.ui.sharingPhoto.threadId : undefined
  }
}

const mapDispatchToProps = (dispatch: Dispatch<RootAction>): DispatchProps => {
  return {
    updateComment: (text: string) => { dispatch(UIActions.updateSharingPhotoComment(text)) },
    share: (image?: SharedImage | PhotoId, threadId?: ThreadId, comment?: string) => { dispatch(UIActions.sharePhotoRequest(image, threadId, comment)) },
    cancelShare: () => { dispatch(UIActions.cancelSharingPhoto()) },
    shareNewThread: (imageId: PhotoId, threadName: string, comment?: string) => { dispatch(PhotoViewingActions.addThreadRequest(threadName, { sharePhoto: { imageId, comment } })) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCaptionScreen)
