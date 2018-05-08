import React from 'react'
import {ScrollView, Text, KeyboardAvoidingView, View, StatusBar, Image, Linking} from 'react-native'
import Gallery from 'react-native-image-gallery'
import { Icon } from 'react-native-elements'
import Toast, {DURATION} from 'react-native-easy-toast'
import { connect } from 'react-redux'
import IpfsActions from '../Redux/TextileRedux'
import { Buffer } from 'buffer'
import IPFS from '../../TextileIPFSNativeModule'

// Styles
import styles from './Styles/PhotoViewerScreenStyle'
import {buttonColor1} from "./Styles/InfoViewStyle";

class PhotoViewerScreen extends React.PureComponent {

  dismissPressed () {
    this.props.screenProps.dismiss()
  }

  renderImage(props, dims) {
    var item = props.image.data
    return (<Image
      source={getRequestFor(item, '/photo')}
      style={{flex: 1, height: undefined, width: undefined}}
      resizeMode="contain"
    />)
  }

  sharePressed () {
    const page = this.refs.gallery.currentPage
    const hash = this.props.imageData[page].hash
    this.props.share(hash)
    this.refs.toast.show('Done!', DURATION.LENGTH_SHORT)
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

  render () {
    return (
      <View style={{flex: 1}}>
        <StatusBar hidden />
        <Gallery
          ref='gallery'
          style={{ flex: 1, backgroundColor: 'black' }}
          images={this.props.imageData}
          initialPage={this.props.initialIndex}
          imageComponent={this.renderImage.bind(this)}
        />
        { this.galleryCount }
        { this.caption }
        <Toast ref='toast' position='center' />
      </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const items = state.ipfs.threads[ownProps.navigation.state.params.thread].items
  const imageData = items.map((item, idx) => {
    return {
      hash: item.hash,
      data: item,
      // source: getRequestFor(item, '/thumb'),
      // Hacky, but for react-native-image-galary, this is required
      // source: {
      //   uri: item.proto + '://' + item.hash + ':' + item.token + "@" + item.host + '/ipfs/' + item.hash + '/thumb'
      // }
    }
  })
  return {
    imageData,
    initialIndex: ownProps.navigation.state.params.initialIndex,
    sharable: ownProps.navigation.state.params.sharable
  }
}

const getRequestFor = (item, path) => {
  var token = IPFS.getHashToken(item.hash)
  console.log(token)
  var encoded = Buffer.from(item.hash + ':' + token).toString('base64')
  console.log(item.proto + '://' + item.host + '/ipfs/' + item.hash + path)
  return  {
    uri: item.proto + '://' + item.host + '/ipfs/' + item.hash + path,
    headers: {
      Authorization: 'Basic ' + encoded
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    share: (hash) => { dispatch(IpfsActions.shareImageRequest('beta', hash)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PhotoViewerScreen)
