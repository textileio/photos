import React from 'react'
import {
  Text,
  View,
  StatusBar,
  TouchableOpacity
} from 'react-native'
import SvgUri from 'react-native-svg-uri'
import Modal from 'react-native-modal'
import Gallery from 'react-native-image-gallery'
import { Icon } from 'react-native-elements'
import { connect } from 'react-redux'
import UIActions from '../Redux/UIRedux'
import SharingDialog from './SharingDialog'
import ProgressiveImage from '../Components/ProgressiveImage'

// Styles
import styles from './Styles/PhotoViewerScreenStyle'

const jdenticon = require('jdenticon')

class PhotoViewerScreen extends React.PureComponent {
  dismissPressed () {
    // Little hacky here for now
    // This one dispatches an action to clear the state of the viewed photo
    this.props.dismiss()
    // This is actually dismissing the modal since we have no way to do that from a saga or otherwise
    this.props.screenProps.dismiss()
  }

  renderImage (props, dims) {
    return (<ProgressiveImage
      previewSource={{hash: props.image.hash, path: 'thumb'}}
      source={{hash: props.image.hash, path: 'photo'}}
      style={{flex: 1, height: undefined, width: undefined}}
      resizeMode={props.resizeMode}
      capInsets={props.capInsets}
    />)
  }

  sharePressed () {
    const page = this.refs.gallery.currentPage
    const item = this.props.imageData[page]
    this.props.authorShare(item)
  }

  get galleryCount () {
    return (
      <View style={{ flex: 1, flexDirection: 'row-reverse', padding: 8, top: 0, height: 60, backgroundColor: 'rgba(0, 0, 0, 0.7)', width: '100%', position: 'absolute', justifyContent: 'space-between' }}>
        <Icon name='close' type='evilicon' color='#FFFFFF' underlayColor='rgba(0, 0, 0, 0)' size={44} onPress={this.dismissPressed.bind(this)} />
        {this.props.sharable &&
        <Icon name='share-apple' type='evilicon' color='#FFFFFF' underlayColor='rgba(0, 0, 0, 0)' size={44} onPress={this.sharePressed.bind(this)} />
        }
      </View>
    )
  }

  get caption () {
    const row = this.props.imageData[this.props.currentIndex]
    const caption = row.caption || ''
    let username = 'anonymous'
    // this check is to temporarily fix issue#91
    if (row.meta && row.meta.username) {
      username = row.meta.username
    }
    let avatar = ''
    try {
      avatar = jdenticon.toSvg(username, 50)
    } catch (err) {}
    return (
      <View style={{
        position: 'absolute',
        width: '100%',
        bottom: 0,
        height: '20%',
        paddingHorizontal: 30,
        backgroundColor: 'rgba(0,0,0, 1)'
      }}>
        <View style={{
          width: '100%',
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 10
        }}>
          <View
            style={{
              width: '36',
              height: '36',
              alignItems: 'center',
              backgroundColor: 'rgba(250, 250, 250, 0.1)'
            }}
            height={36}
            width={36}
          >
            <SvgUri
              style={{margin: 2, width: 32, height: 32}}
              width={32}
              height={32}
              svgXmlData={avatar}
              />
          </View>
          <Text
            style={{paddingLeft: 10, textAlign: 'left', color: 'white', fontSize: 18}}>
            {username}
          </Text>
        </View>
        <View style={{
          padding: 4
        }}>
          <Text
            numberOfLines={3}
            style={{
              textAlign: 'left',
              color: 'white',
              fontSize: 18
            }}>
            {caption}
          </Text>
        </View>
      </View>
    )
  }

  _renderButton = (text, onPress) => (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text>{text}</Text>
      </View>
    </TouchableOpacity>
  )

  _renderModalContent = () => (
    <SharingDialog />
  )

  render () {
    return (
      <View style={{flex: 1}}>
        <StatusBar hidden />

        <Modal isVisible={this.props.visibleModal} animationIn={'fadeInUp'} animationOut={'fadeOutDown'} avoidKeyboard >
          {this._renderModalContent()}
        </Modal>

        <Gallery
          ref='gallery'
          style={{ flex: 1, backgroundColor: 'black' }}
          images={this.props.imageData}
          initialPage={this.props.currentIndex}
          // flatListProps={{windowSize: 1, initialNumToRender: 6}}
          imageComponent={this.renderImage.bind(this)}
          onPageSelected={this.props.selectImage}
        />

        { this.galleryCount }

        { !this.props.sharable && this.caption }

      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const items = state.ipfs.threads[state.ui.viewingPhoto.thread].items
  const path = state.ui.viewingPhoto.thread === 'default' ? '/photo' : '/thumb'
  const sharable = state.ui.viewingPhoto.thread === 'default'
  const imageData = items.map(item => {
    return {
      ...item,
      key: item.hash + path,
      source: {url: 'file://' + item.hash + '.png'}, // <-- in case RN uses to know things
      dimensions: { width: 150, height: 150 },
      displayImages: state.ipfs.nodeState.state === 'started'
    }
  })
  return {
    imageData,
    currentIndex: state.ui.viewingPhoto.index,
    sharable,
    visibleModal: state.ui.sharingPhoto.active
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    authorShare: (item) => { dispatch(UIActions.authorPhotoShareRequest(item.hash)) },
    selectImage: (index) => { dispatch(UIActions.selectImage(index)) },
    dismiss: () => { dispatch(UIActions.dismissViewedPhoto()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PhotoViewerScreen)
