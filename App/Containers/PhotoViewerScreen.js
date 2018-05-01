import React from 'react'
import {
  ScrollView,
  Text,
  KeyboardAvoidingView,
  View,
  StatusBar,
  Image,
  Linking
} from 'react-native'
import Gallery from 'react-native-image-gallery'
import { Icon } from 'react-native-elements'
import Toast, {DURATION} from 'react-native-easy-toast'
import { connect } from 'react-redux'
import IPFS from '../../TextileIPFSNativeModule'

// Styles
import styles from './Styles/PhotoViewerScreenStyle'
import {buttonColor1} from "./Styles/InfoViewStyle";

class PhotoViewerScreen extends React.PureComponent {

  // componentWillMount() {
  //   // TODO: Do something with this? Do we need the metadata?
  //   const item = this.props.navigation.state.params.item
  //   fetch('https://localhost:9080/ipfs/' + item.image.hash + '/meta')
  //     .then((response) => response.json())
  //     .then((responseJson) => {
  //       this.setState({meta: new Date(responseJson.created)});
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     })
  // }

  dismissPressed () {
    this.props.screenProps.dismiss()
  }

  sharePressed () {
    this.refs.toast.show('Sharing coming soon!', DURATION.LENGTH_SHORT)
  }

  get viewScreen () {
    return (
      <View style={{ flex: 1, flexDirection: 'row', padding: 8, top: 0, height: 60, backgroundColor: 'rgba(0, 0, 0, 0.7)', width: '100%', position: 'absolute', justifyContent: 'space-between' }}>
        <Icon name='close' type='evilicon' color='#FFFFFF' underlayColor='rgba(0, 0, 0, 0)' size={44} onPress={this.dismissPressed.bind(this)} />
        <Icon name='share-apple' type='evilicon' color='#FFFFFF' underlayColor='rgba(0, 0, 0, 0)' size={44} onPress={this.sharePressed.bind(this)} />
      </View>
    )
  }

  // get caption () {
  //   return (
  //     <View style={{ bottom: 0, height: 65, backgroundColor: 'rgba(0, 0, 0, 0.7)', width: '100%', position: 'absolute', justifyContent: 'center' }}>
  //       <Text style={{ textAlign: 'center', color: 'white', fontSize: 15, fontStyle: 'italic' }}>{'Some metadata'}</Text>
  //     </View>
  //   )
  // }

  renderImage(image) {
    return (
      <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'rgba(0, 0, 0, 1)' }}>
        <Image
          source={{uri: 'https://localhost:9080/ipfs/' + image.hash + '/photo'}}
          style={{ flex: 1, width: null, height: null }}
          resizeMode="contain"
        />
      </View>
    )
  }

  render () {
    const item = this.props.navigation.state.params.item
    return (
      <View style={{flex: 1}}>
        <StatusBar hidden />
        { this.renderImage(item.image) }
        { this.viewScreen }
        <Toast ref='toast' position='center' />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PhotoViewerScreen)
