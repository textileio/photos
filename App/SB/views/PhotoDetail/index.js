import React, {Component} from 'react'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import { View, Text, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native'
import Toast from 'react-native-easy-toast'
import Modal from 'react-native-modal'

import { TextileHeaderButtons, Item } from '../../../Components/HeaderButtons'

import ShareToThread from '../../../Components/ShareToThread'

import ProgressiveImage from '../../../Components/ProgressiveImage'

import BottomDrawerPhotos from '../../components/BottomDrawerPhotos'
import PhotoWithTextBox from '../../components/PhotoWithTextBox'
import PhotoBoxEmpty from '../../components/PhotoBoxEmpty'

import styles from './statics/styles'

import UIActions from '../../../Redux/UIRedux'

// via https://github.com/react-native-community/react-native-modal/issues/147
const WIDTH = Dimensions.get('window').width
// May be slightly off on some bigger Android devices...
const HEIGHT = Dimensions.get('window').height

class PhotoDetail extends Component {
  constructor (props) {
    super(props)
    let heightByWidth = this.props.metadata ? (this.props.metadata.height / this.props.metadata.width) * WIDTH : WIDTH
    this.state = {
      drawer: false,
      heightByWidth
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      this.props.metadata !== prevProps.metadata
    ) {
      let heightByWidth = this.props.metadata ? (this.props.metadata.height / this.props.metadata.width) * WIDTH : WIDTH
      this.setState({heightByWidth})
    }
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
      getPublicLink: this.getPublicLink.bind(this)
    })
  }

  sharePressed () {
    this.setState({drawer: true})
    this.props.shareImage(this.props.photo.id)
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
    this.props.shareToThread(thread.id)
    this.props.navigation.navigate('WalletSharePhoto')
  }

  // If a user wants to see a photo in a thread, this will navigate to the thread
  viewThread (thread) {
    this.props.navigation.navigate('ViewThread', { id: thread.id, name: thread.name })
  }

  renderImage () {
    return (<ProgressiveImage
      imageId={this.props.photo.id}
      previewPath={'small'}
      path={'photo'}
      style={{height: this.state.heightByWidth, width: WIDTH, marginBottom: 10}}
      resizeMode={'cover'}
    />)
  }

  render () {
    return (
      <ScrollView style={styles.bodyContainer}>
        {this.renderImage()}
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
              <PhotoWithTextBox key={i} text={thread.name} item={this.props.thumbs[thread.id]}/>
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
    shareImage: (imageId) => { dispatch(UIActions.updateSharingPhotoImage(imageId)) },
    shareToThread: (threadId) => { dispatch(UIActions.updateSharingPhotoThread(threadId)) },
    getPublicLink: (imageId) => { dispatch(UIActions.getPublicLink(imageId)) }
  }
}

const mapStateToProps = (state, ownProps) => {
  const thread = state.threads.threads.find(thread => thread.id === state.ui.viewingPhoto.threadId)
  const item = state.textileNode.threads[state.ui.viewingPhoto.threadId].items.find((it) => it.photo.id === state.ui.viewingPhoto.photoId)

  // Used to generate lists of which Threads the image is and
  // which Threads you might want to share the image to
  let containingThreads = []
  // Used to pick the thumb to show beside each thread
  const thumbs = {}
  for (let t in state.textileNode.threads) {
    if (state.textileNode.threads[t].items.length > 0) {
      thumbs[t] = state.textileNode.threads[t].items[state.textileNode.threads[t].items.length - 1]
    }
    if (state.textileNode.threads[t].items.find(i => i.photo.id === item.photo.id)) {
      containingThreads.push(t)
    }
  }

  let threadsNotIn = state.threads.threads.filter(t => containingThreads.indexOf(t.id) < 0 && t.name !== 'default').map(t => {
    return {
      ...t,
      size: !state.textileNode.threads[t.id] ? 0 : state.textileNode.threads[t.id].items.length
    } }).sort((a, b) => b - a)


  const path = thread.name === 'default' ? '/photo' : '/thumb'
  return {
    ...item,
    date: item.photo.date.split('T')[0],
    key: item.photo.id + path,
    source: {url: 'file://' + item.photo.id + '.png'}, // <-- in case RN uses to know things
    // TODO: real dimensions are in the metadata alread now
    dimensions: { width: 150, height: 150 },
    displayImages: state.textileNode.nodeState.state === 'started',
    threadsIn: state.threads.threads.filter(t => containingThreads.indexOf(t.id) > -1 && t.name !== 'default'),
    threadsNotIn,
    thumbs
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PhotoDetail)

