import React from 'react'
import {
  Text,
  View,
  StatusBar,
  TouchableOpacity
} from 'react-native'
import Modal from 'react-native-modal'
import Gallery from 'react-native-image-gallery'
import { Icon } from 'react-native-elements'
import Toast, {DURATION} from 'react-native-easy-toast'
import { connect } from 'react-redux'
import IpfsActions from '../Redux/TextileRedux'
import UIActions from '../Redux/UIRedux'

// Styles
import styles from './Styles/PhotoViewerScreenStyle'
import {buttonColor1} from "./Styles/InfoViewStyle";

class PhotoViewerScreen extends React.PureComponent {

  dismissPressed () {
    this.props.screenProps.dismiss()
  }

  sharePressed () {
    const page = this.refs.gallery.currentPage
    const hash = this.props.imageData[page].hash
    // this.props.share(hash)
    // this.refs.toast.show('Done!', DURATION.LENGTH_SHORT)
    this.props.authorShare(hash)
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
    <View style={styles.modalContent}>
      <Text>Hello!</Text>
      {this._renderButton('Close', () => this.props.cancelAuthoringShare())}
    </View>
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
        />
        { this.galleryCount }
        { this.caption }
        <Toast ref='toast' position='center' />
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const hashes = state.ipfs.threads[ownProps.navigation.state.params.thread].hashes
  const imageData = hashes.map(hash => {
    return { hash, source: { uri: 'https://localhost:9080/ipfs/' + hash + '/photo' } }
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
    share: (hash) => { dispatch(IpfsActions.shareImageRequest('beta', hash)) },
    authorShare: (hash) => { dispatch(UIActions.authorPhotoShare(hash)) },
    cancelAuthoringShare: () => { dispatch(UIActions.cancelAuthoringPhotoShare()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PhotoViewerScreen)
