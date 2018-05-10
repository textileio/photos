import React from 'react'
import {
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  Image
} from 'react-native'
import Modal from 'react-native-modal'
import Gallery from 'react-native-image-gallery'
import { Icon } from 'react-native-elements'
import { connect } from 'react-redux'
import IpfsActions from '../Redux/TextileRedux'
import IPFS from '../../TextileIPFSNativeModule'
import UIActions from '../Redux/UIRedux'
import SharingDialog from './SharingDialog'
import AsyncImage from '../Components/AsyncImage'

// Styles
import styles from './Styles/PhotoViewerScreenStyle'
import {buttonColor1} from "./Styles/InfoViewStyle";

class PhotoViewerScreen extends React.PureComponent {
  dismissPressed () {
    this.props.screenProps.dismiss()
  }

  renderImage (props, dims) {
    return (<AsyncImage
      key={props.image.key}
      hash={props.image.hash}
      path={props.image.path}
      style={{flex: 1, height: undefined, width: undefined}}
      resizeMode={props.resizeMode}
      capInsets={props.capInsets}
    />)
  }

  sharePressed () {
    const page = this.refs.gallery.currentPage
    const item = this.props.imageData[page]
    this.props.authorShare(item.hash)
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
    return (
      <View style={{ bottom: 0, height: 65, backgroundColor: 'rgba(0, 0, 0, 0.7)', width: '100%', position: 'absolute', justifyContent: 'center' }}>
        <Text style={{ textAlign: 'center', color: 'white', fontSize: 15, fontStyle: 'italic' }}>{'Some metadata'}</Text>
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

        <Modal isVisible={this.props.visibleModal} animationIn={'fadeInUp'} animationOut={'fadeOutDown'}>
          {this._renderModalContent()}
        </Modal>

        <Gallery
          ref='gallery'
          style={{ flex: 1, backgroundColor: 'black' }}
          images={this.props.imageData}
          initialPage={this.props.initialIndex}
          flatListProps={{windowSize: 1, initialNumToRender: 2}}
          imageComponent={this.renderImage.bind(this)}
        />
        { this.galleryCount }
        { this.caption }
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const items = state.ipfs.threads[ownProps.navigation.state.params.thread].items
  const path = ownProps.navigation.state.params.thread === 'default' ? '/photo' : '/thumb'
  const imageData = items.map(item => {
    return { ...item, path, key: item.hash + path, source: {url: 'file://foo.png'} }
  })
  return {
    imageData,
    initialIndex: ownProps.navigation.state.params.initialIndex,
    sharable: ownProps.navigation.state.params.sharable,
    visibleModal: state.ui.authoringPhotoShare !== null
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    share: (item) => { dispatch(IpfsActions.shareImageRequest('beta', item.hash)) },
    authorShare: (hash) => { dispatch(UIActions.authorPhotoShare(hash)) },
    cancelAuthoringShare: () => { dispatch(UIActions.cancelAuthoringPhotoShare()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PhotoViewerScreen)
