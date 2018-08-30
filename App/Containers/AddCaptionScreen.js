import React from 'react'
import { connect } from 'react-redux'
import { Image, View } from 'react-native'
import { TextileHeaderButtons, Item } from '../Components/HeaderButtons'
import Input from '../SB/components/Input'
import { NavigationActions } from 'react-navigation'
import styles from '../SB/views/ThreadCreate/statics/styles'
import UIActions from '../Redux/UIRedux'
import TextileImage from '../../TextileImage'

class AddCaptionScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    return {
      headerTitle: 'Photo Caption',
      headerLeft: (
        <TextileHeaderButtons left>
          <Item title='Back' iconName='arrow-left' onPress={() => {
            params.cancelShare()
            navigation.dispatch(NavigationActions.navigate({ routeName: params.backTo }))
          }} />
        </TextileHeaderButtons>
      ),
      headerRight: (
        <TextileHeaderButtons>
          <Item title='Share' onPress={() => {
            if (params.withPhoto && params.withThreadName) {
              params.shareToNewThread(params.withPhoto, params.withThreadName)
              navigation.dispatch(NavigationActions.navigate({ routeName: params.backTo }))
            } else {
              params.share()
              navigation.dispatch(NavigationActions.navigate({ routeName: params.backTo }))
            }
          }} />
        </TextileHeaderButtons>
      ),
    }
  }

  handleNewText = (text: string) => {
    this.props.updateComment(text)
  }

  componentWillMount () {
    this.props.navigation.setParams({
      cancelShare: () => { this.props.cancelShare() },
      share: () => { this.props.share(this.props.image, this.props.threadId, this.props.comment) },
      shareToNewThread: this._shareToNewThread.bind(this)
    })
  }

  _shareToNewThread (withPhoto, withThreadName) {
    this.props.shareNewThread(withPhoto.id, withThreadName, this.props.comment)
  }

  _renderTextileImage () {
    return (<TextileImage
      imageId={this.props.image}
      path={'small'}
      height={70}
      width={70}
      resizeMode={'cover'}
      style={styles.image}
    />)
  }

  _renderAsset () {
    const sourceUri = this.props.image.origURL && this.props.image.origURL !== ''
      ? this.props.image.origURL
      : this.props.image.uri
    return (
      <Image
        source={{uri: sourceUri, isStatic: true}}
        resizeMode={'cover'}
        style={styles.image} />
    )
  }

  _renderImage () {
    if (typeof this.props.image === 'string') {
      return this._renderTextileImage()
    } else if (this.props.image) {
      return this._renderAsset()
    }
  }

  render () {
    return (
      <View style={styles.contentContainer}>
        <View style={styles.topRow}>
          <View style={styles.imagePreviewRow}>
            { this._renderImage() }
          </View>
          <View style={styles.commentRow}>
            <Input
              style={styles.comment}
              value={this.props.comment}
              label='Add a caption...'
              numberOfLines={5}
              onChangeText={this.handleNewText.bind(this)}
            />
          </View>
        </View>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  const sharingPhoto = state.ui.sharingPhoto || {}
  return {
    image: sharingPhoto.image,
    threadId: sharingPhoto.threadId,
    comment: sharingPhoto.comment
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateComment: (text) => { dispatch(UIActions.updateSharingPhotoComment(text)) },
    share: (image, threadId, comment) => { dispatch(UIActions.sharePhotoRequest(image, threadId, comment)) },
    cancelShare: () => { dispatch(UIActions.cancelSharingPhoto()) },
    shareNewThread: (imageId, threadName, comment) => { dispatch(UIActions.sharePhotoToNewThreadRequest(imageId, threadName, comment)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCaptionScreen)
