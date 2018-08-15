import React, {Component} from 'react'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import { Alert, View, Text, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native'
import Toast from 'react-native-easy-toast'
import Modal from 'react-native-modal'

import UIActions from '../../../Redux/UIRedux'
import TextileNodeActions from '../../../Redux/TextileNodeRedux'

import { TextileHeaderButtons, Item } from '../../../Components/HeaderButtons'

import ShareToThread from '../../../Components/ShareToThread'

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
      ...heightProperties,
      drawer: false
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // if (
    //   this.props.photo.metadata !== prevProps.photo.metadata
    // ) {
    //   const heightProperties = getHeight(this.props.photo.metadata, WIDTH)
    //   this.setState({
    //     ...heightProperties
    //   })
    // }
  }

  static navigationOptions = ({ navigation }) => {
    const {params = {}} = navigation.state
    const headerLeft = (
      <TextileHeaderButtons left>
        <Item title='Back' iconName='arrow-left' onPress={() => { navigation.dispatch(NavigationActions.back()) }} />
      </TextileHeaderButtons>
    )
    const headerRight = (
      <TextileHeaderButtons>
        <Item title='Add To Thread' iconName='add-user' onPress={params.sharePressed} />
        <Item title='Share' iconName='share' onPress={params.getPublicLink} />
        <Item title='Delete' iconName='delete' onPress={params.removePhoto} />
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
    this.setState({drawer: true})
    this.props.shareImage(this.props.photo.id)
  }

  removePhoto () {
    if (this.props.photo && this.props.photo.block_id) {
      Alert.alert(
        'Remove Photo',
        'This will remove the photo from your private wallet. Camera roll, Profile, and Threads will not be modified.',
        [
          {text: 'Cancel', style: 'cancel'},
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

  shareClosed () {
    this.setState({drawer: false})
  }

  // For when the user wants to share it into a selected thread
  shareIntoThread (i) {
    this.setState({drawer: false})
    const thread = this.props.threadsNotIn[i]
    this.props.authorShare(this.props.photo.id)
    this.props.navigation.navigate('SharePhoto', {thread, photo: this.props.photo})
  }

  // If a user wants to see a photo in a thread, this will navigate to the thread
  viewThread (thread) {
    this.props.navigation.navigate('ViewThread', { id: thread.id, name: thread.name })
  }

  renderImage (id) {
    return (<ProgressiveImage
      imageId={id}
      previewPath={'small'}
      path={'photo'}
      style={{height: this.state.height, width: WIDTH, marginBottom: 10}}
      resizeMode={'cover'}
    />)
  }

  render () {
    return (
      <ScrollView style={styles.bodyContainer}>
        <View style={{overflow: 'hidden', height: this.state.height, width: WIDTH}}>
          {this.props.photo && this.renderImage(this.props.photo.id)}
        </View>
        <View style={styles.photoDetails}>
          <View style={styles.detailItem}>
            {/*<Image style={styles.iconLocation} source={require('./statics/icon-location.png')}/>*/}
            {/*<Text style={styles.detailText}>Earth</Text>*/}
          </View>
          <View style={[styles.detailItem, {flexGrow: 1}]}>
            <Image style={styles.iconCalendar} source={require('./statics/icon-calendar.png')} />
            <Text style={styles.detailText}>{this.props.date}</Text>
          </View>
          {/*<Image style={styles.iconInfo} source={require('./statics/icon-info.png')} />*/}
        </View>
        <ScrollView style={styles.contentContainer}>
          <Text style={styles.threadsTitle}>
            {this.props.threadsIn.length > 0 ? 'This photo appears in the following threads:' : 'You haven\'t shared this photo anywhere yet'}
          </Text>
          {this.props.threadsIn.map((thread, i) => (
            <TouchableOpacity key={i} onPress={() => { this.viewThread(thread) }}>
              <PhotoWithTextBox key={i} text={thread.name} photo={this.props.thumbs[thread.id]}/>
            </TouchableOpacity>
          ))}
          { this.props.threadsIn.length > 0 &&
          <TouchableOpacity onPress={this.sharePressed.bind(this)}>
            <PhotoBoxEmpty style={{marginBottom: 9, marginTop: 0}} title='Share in another thread'/>
          </TouchableOpacity> }
        </ScrollView>
        <Modal isVisible={this.state.drawer} animationIn={'fadeInUp'} animationOut={'fadeOutDown'} avoidKeyboard backdropColor={'#E1E1E1'} backdropOpacity={0.5} style={{width: WIDTH, height: HEIGHT, margin: 0, padding: 0, justifyContent: "flex-end"}}>
          <ShareToThread
            selector={this.shareIntoThread.bind(this)}
            threads={this.props.threadsNotIn}
            thumbs={this.props.thumbs}
            onClose={() => this.shareClosed()}
          />
        </Modal>
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
    authorShare: (imageId) => { dispatch(UIActions.authorPhotoShareRequest(imageId)) },
    shareImage: (imageId) => { dispatch(UIActions.authorPhotoShareRequest(imageId)) },
    getPublicLink: (imageId) => { dispatch(UIActions.getPublicLink(imageId)) },
    ignorePhoto: (threadId, blockId) => { dispatch(TextileNodeActions.ignorePhotoRequest(threadId, blockId)) }
  }
}

const mapStateToProps = (state, ownProps) => {
  const thread = state.threads.threads.find(thread => thread.id === state.ui.viewingPhoto.threadId)
  const photo = state.textileNode.threads[state.ui.viewingPhoto.threadId].photos.find((it) => it.id === state.ui.viewingPhoto.photoId)

  // Used to generate lists of which Threads the image is and
  // which Threads you might want to share the image to
  let containingThreads = []
  // Used to pick the thumb to show beside each thread
  const thumbs = {}
  for (let t in state.textileNode.threads) {
    if (state.textileNode.threads[t].photos.length > 0) {
      thumbs[t] = state.textileNode.threads[t].photos[state.textileNode.threads[t].photos.length - 1]
    }
    if (photo && photo.id && state.textileNode.threads[t].photos.find(i => i.id === photo.id)) {
      containingThreads.push(t)
    }
  }

  let threadsNotIn = state.threads.threads.filter(t => containingThreads.indexOf(t.id) < 0 && t.name !== 'default').map(t => {
    return {
      ...t,
      size: !state.textileNode.threads[t.id] ? 0 : state.textileNode.threads[t.id].photos.length
    }
  }).sort((a, b) => b - a)

  const path = thread.name === 'default' ? '/photo' : '/thumb'
  const source = photo ? {url: 'file://' + photo.id + '.png'} : {url: 'file://.png'}

  return {
    photo,
    date: photo && photo.date ? photo.date.split('T')[0] : '',
    key: photo && photo.id ? photo.id + path : path,
    // TODO: real dimensions are in the metadata alread now
    dimensions: { width: 150, height: 150 },
    displayImages: state.textileNode.nodeState.state === 'started',
    threadId: state.ui.viewingPhoto.threadId,
    threadsIn: state.threads.threads.filter(t => containingThreads.indexOf(t.id) > -1 && t.name !== 'default'),
    threadsNotIn,
    thumbs,
    source // <-- in case RN uses to know things
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PhotoDetail)
