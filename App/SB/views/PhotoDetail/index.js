import React, { Component } from 'react'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import { Alert, View, Text, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native'
import Toast from 'react-native-easy-toast'

import UIActions from '../../../Redux/UIRedux'
import TextileNodeActions from '../../../Redux/TextileNodeRedux'
import PhotoViewingActions from '../../../Redux/PhotoViewingRedux'
import { getThreads, defaultThreadData } from '../../../Redux/PhotoViewingSelectors'

import { TextileHeaderButtons, Item } from '../../../Components/HeaderButtons'
import ProgressiveImage from '../../../Components/ProgressiveImage'
import PhotoWithTextBox from '../../components/PhotoWithTextBox'
import PhotoBoxEmpty from '../../components/PhotoBoxEmpty'

import { getHeight } from '../../../Services/PhotoUtils'

import styles from './statics/styles'

// via https://github.com/react-native-community/react-native-modal/issues/147
const WIDTH = Dimensions.get('window').width

class PhotoDetail extends Component {

  static navigationOptions = ({ navigation }) => {
    const { params = {} } = navigation.state
    const headerLeft = (
      <TextileHeaderButtons left>
        <Item title='Back' iconName='arrow-left' onPress={() => { navigation.dispatch(NavigationActions.back()) }} />
      </TextileHeaderButtons>
    )
    const headerRight = (
      <TextileHeaderButtons>
        <Item title='Add To Thread' iconName='share' onPress={params.sharePressed} />
        <Item title='Share' iconName='share-arrow' onPress={params.shareByLink} />
        <Item title='Delete' iconName='circle-x' onPress={params.removePhoto} />
      </TextileHeaderButtons>
    )
    return {
      headerRight,
      headerLeft
    }
  }

  componentDidMount () {
    this.props.navigation.setParams({
      sharePressed: this.sharePressed.bind(this),
      shareByLink: this.shareByLink.bind(this),
      removePhoto: this.removePhoto.bind(this)
    })
  }

  sharePressed () {
    this.props.shareImage(this.props.photo.target)
    this.props.navigation.navigate('WalletSharePhoto', { backTo: 'PrivatePhotoDetail', withPhoto: this.props.photo })
  }

  removePhoto () {
    if (this.props.photo && this.props.photo.block_id) {
      Alert.alert(
        'Remove Photo',
        'This will remove the photo from your private wallet. Camera roll, Profile, and Threads will not be modified.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'OK',
            onPress: () => {
              this.props.ignorePhoto(this.props.threadId, this.props.photo.block_id)
            }
          }
        ],
        { cancelable: false }
      )
    }
  }

  shareByLink () {
    this.refs.toast.show('You are creating a public link for this photo!', 1000)
    this.props.shareByLink(this.props.photo.files.target + '/0/large?key=' + this.props.photo.files[0]['links']['key'])
  }

  // If a user wants to see a photo in a thread, this will navigate to the thread
  viewThread (thread) {
    this.props.viewThread(thread.id)
    this.props.navigation.navigate('ViewThread', { id: thread.id, name: thread.name })
  }

  renderImage (id) {
    return (<ProgressiveImage
      imageId={id}
      showPreview={true}
      forMinWidth={WIDTH}
      style={{ height: this.props.height, width: this.props.width, marginBottom: 10 }}
      resizeMode={'cover'}
    />)
  }

  render () {
    return (
      <ScrollView style={styles.bodyContainer}>
        <View style={{ overflow: 'hidden', height: this.props.height, width: this.props.width }}>
          {this.props.photo && this.renderImage(this.props.photo.target)}
        </View>
        <View style={styles.photoDetails}>
          <View style={styles.detailItem}>
            {/* <Image style={styles.iconLocation} source={require('./statics/icon-location.png')}/> */}
            {/* <Text style={styles.detailText}>Earth</Text> */}
          </View>
          <View style={[styles.detailItem, { flexGrow: 1 }]}>
            <Image style={styles.iconCalendar} source={require('./statics/icon-calendar.png')} />
            <Text style={styles.detailText}>{this.props.date}</Text>
          </View>
          {/* <Image style={styles.iconInfo} source={require('./statics/icon-info.png')} /> */}
        </View>
        <ScrollView style={styles.contentContainer}>
          <Text style={styles.threadsTitle}>
            {this.props.threadsIn.length > 0 ? 'This photo appears in the following threads:' : 'You haven\'t shared this photo anywhere yet'}
          </Text>
          {this.props.threadsIn.map((thread, i) => (
            <TouchableOpacity key={i} onPress={() => { this.viewThread(thread) }}>
              <PhotoWithTextBox key={i} text={thread.name} photo={this.props.thumbs[thread.id]} />
            </TouchableOpacity>
          ))}
          { this.props.threadsIn.length > 0 &&
          <TouchableOpacity onPress={this.sharePressed.bind(this)}>
            <PhotoBoxEmpty style={{ marginBottom: 9, marginTop: 0 }} title='Share now' />
          </TouchableOpacity> }
        </ScrollView>
        <Toast
          ref='toast'
          position='top'
          positionValue={20}
        />
      </ScrollView>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    viewThread: (threadId) => { dispatch(PhotoViewingActions.viewThread(threadId)) },
    shareImage: (imageId) => { dispatch(UIActions.updateSharingPhotoImage(imageId)) },
    shareToThread: (threadId) => { dispatch(UIActions.updateSharingPhotoThread(threadId)) },
    shareByLink: (path) => { dispatch(UIActions.shareByLink(path)) },
    ignorePhoto: (threadId, blockId) => { dispatch(TextileNodeActions.ignorePhotoRequest(threadId, blockId)) }
  }
}

const mapStateToProps = (state) => {
  const defaultData = defaultThreadData(state)
  const photo = state.photoViewing.viewingWalletPhoto

  // Used to generate lists of which Threads the image is and
  // which Threads you might want to share the image to
  let containingThreads = []
  // Used to pick the thumb to show beside each thread
  const thumbs = {}
  for (let t of Object.keys(state.photoViewing.threads)) {
    if (state.photoViewing.threads[t].photos.length > 0) {
      thumbs[t] = state.photoViewing.threads[t].photos[state.photoViewing.threads[t].photos.length - 1]
    }
    if (photo && photo.target && state.photoViewing.threads[t].photos.find(i => i.target === photo.target)) {
      containingThreads.push(t)
    }
  }

  const threads = getThreads(state)
  const threadsInIds = photo.threads
  const threadsIn = threads.filter((thread) => threadsInIds.includes(thread.id))

  const path = '/photo'
  const source = photo ? {url: 'file://' + photo.target + '.png'} : {url: 'file://.png'}

  const links = photo.files[0].links
  const meta = links ? links['large'].meta : undefined
  const w = meta ? meta['width'] : undefined
  const h = meta ? meta['height'] : undefined
  const width = WIDTH
  let height = width
  if (w && h) {
    const widthByHeightRatio = w / h
    height = width / widthByHeightRatio
  }

  return {
    photo,
    date: photo && photo.date ? photo.date.split('T')[0] : '',
    key: photo && photo.target ? photo.target + path : path,
    width,
    height,
    displayImages: state.textileNode.nodeState.state === 'started',
    threadId: defaultData.id,
    threadsIn,
    thumbs,
    source // <-- in case RN uses to know things
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PhotoDetail)
