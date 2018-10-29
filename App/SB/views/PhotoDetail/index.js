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
// May be slightly off on some bigger Android devices...
const HEIGHT = Dimensions.get('window').height

class PhotoDetail extends Component {
  constructor (props) {
    super(props)
    const metadata = this.props.photo && this.props.photo.metadata
    const heightProperties = getHeight(metadata, WIDTH)
    this.state = {
      ...heightProperties
    }
  }

  componentDidUpdate (prevProps, prevState) {
    if (
      this.props.photo.metadata !== prevProps.photo.metadata
    ) {
      const heightProperties = getHeight(this.props.photo.metadata, WIDTH)
      this.setState({
        ...heightProperties
      })
    }
  }

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
        <Item title='Share' iconName='share-arrow' onPress={params.getPublicLink} />
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
      getPublicLink: this.getPublicLink.bind(this),
      removePhoto: this.removePhoto.bind(this)
    })
  }

  sharePressed () {
    this.props.shareImage(this.props.photo.id)
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

  getPublicLink () {
    this.refs.toast.show('You are creating a public link for this photo!', 1000)
    this.props.getPublicLink(this.props.photo.id)
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
      style={{ height: this.state.height, width: WIDTH, marginBottom: 10 }}
      resizeMode={'cover'}
    />)
  }

  render () {
    return (
      <ScrollView style={styles.bodyContainer}>
        <View style={{ overflow: 'hidden', height: this.state.height, width: WIDTH }}>
          {this.props.photo && this.renderImage(this.props.photo.id)}
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
    getPublicLink: (imageId) => { dispatch(UIActions.getPublicLink(imageId)) },
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
    if (photo && photo.id && state.photoViewing.threads[t].photos.find(i => i.id === photo.id)) {
      containingThreads.push(t)
    }
  }

  const threads = getThreads(state)

  let threadsNotIn = threads.filter(t => containingThreads.indexOf(t.id) < 0 && t.name !== 'default').map(t => {
    return {
      ...t,
      size: !state.photoViewing.threads[t.id] ? 0 : state.photoViewing.threads[t.id].photos.length
    }
  }).sort((a, b) => b - a)

  const path = '/photo'
  const source = photo ? {url: 'file://' + photo.id + '.png'} : {url: 'file://.png'}

  return {
    photo,
    date: photo && photo.date ? photo.date.split('T')[0] : '',
    key: photo && photo.id ? photo.id + path : path,
    // TODO: real dimensions are in the metadata alread now
    dimensions: { width: 150, height: 150 },
    displayImages: state.textileNode.nodeState.state === 'started',
    threadId: defaultData.id,
    threadsIn: threads.filter(t => containingThreads.indexOf(t.id) > -1 && t.name !== 'default'),
    threadsNotIn,
    thumbs,
    source // <-- in case RN uses to know things
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PhotoDetail)
