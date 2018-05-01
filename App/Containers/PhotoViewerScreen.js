import React from 'react'
import {ScrollView, Text, KeyboardAvoidingView, View, StatusBar, Image, Linking} from 'react-native'
import Gallery from 'react-native-image-gallery'
import { Icon } from 'react-native-elements'
import Toast, {DURATION} from 'react-native-easy-toast'
import { connect } from 'react-redux'
import IPFS from '../../TextileIPFSNativeModule'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/PhotoViewerScreenStyle'
import {buttonColor1} from "./Styles/InfoViewStyle";

class PhotoViewerScreen extends React.PureComponent {

  dismissPressed () {
    this.props.screenProps.dismiss()
  }

  sharePressed () {
    this.refs.toast.show('Sharing coming soon!', DURATION.LENGTH_SHORT)
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

  renderImage(image) {
    const imageData = IPFS.syncGetPhotoData(image.image.hash + '/thumb')
    return (
      <Image
        source={{uri: 'data:image/jpeg;base64,' + imageData}}
        style={image.style}
        resizeMode={image.resizeMode}
        capInsets={image.capInsets}
      />
    )
  }

  render () {
    return (
      <View style={{flex: 1}}>
        <StatusBar hidden />
        <Gallery
          style={{ flex: 1, backgroundColor: 'black' }}
          imageComponent={this.renderImage}
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
    return {
      source: { uri: 'file:///image.jpg' },
      hash,
      dimensions: { width: 100, height: 100 }
    }
  })
  return {
    imageData,
    initialIndex: ownProps.navigation.state.params.initialIndex,
    sharable: ownProps.navigation.state.params.sharable
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PhotoViewerScreen)
