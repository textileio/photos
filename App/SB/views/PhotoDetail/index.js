import React, {Component} from 'react'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation'
import { View, Text, Image, Dimensions, ScrollView, TouchableOpacity, StatusBar } from 'react-native'

import ProgressiveImage from '../../../Components/ProgressiveImage'

import BottomDrawerPhotos from '../../components/BottomDrawerPhotos'
import PhotoWithTextBox from '../../components/PhotoWithTextBox'
import PhotoBoxEmpty from '../../components/PhotoBoxEmpty'

import styles from './statics/styles'

// Originally intended structure of the photo list
// import { photoList } from './constants'

import { Icon } from 'react-native-elements'
import UIActions from '../../../Redux/UIRedux'

const { width } = Dimensions.get('window')

class PhotoDetail extends Component {
  constructor (props) {
    super(props)
    this.state = {
      drawer: false
    }
  }

  static navigationOptions = ({ navigation }) => {
    const {params = {}} = navigation.state
    const headerLeft = (
      <TouchableOpacity onPress={ () => { navigation.dispatch(NavigationActions.back()) }}>
        <Image
          style={styles.toolbarLeft}
          source={require('./statics/icon-arrow-left.png')}
        />
      </TouchableOpacity>
    )
    const headerRight = (
        <View style={styles.toolbarIconsList}>
          <TouchableOpacity onPress={params.sharePressed}>
            <Image style={styles.toolbarAddIcon} source={require('./statics/icon-add.png')}/>
          </TouchableOpacity>
          <Image style={styles.toolbarDownloadIcon} source={require('./statics/icon-download.png')}/>
          <Image style={styles.toolbarShareIcon} source={require('./statics/icon-share.png')}/>
          <Image style={styles.toolbarRemoveIcon} source={require('./statics/icon-remove.png')}/>
        </View>
    )

    return {
      headerRight,
      headerLeft,
      tabBarVisible: false
    }
  }

  componentDidMount() {
    this.props.navigation.setParams({
      sharePressed: this.sharePressed.bind(this),
    })
  }

  sharePressed () {
    this.setState({drawer: true})
    this.props.shareImage(this.props.photo.id)
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
    console.log(this.props)
    this.props.navigation.navigate('ViewThread', { id: thread.id, name: thread.name })
  }

  createThread () {
    this.setState({drawer: false})
    this.props.navigation.navigate('AddThread')
  }

  renderImage () {
    return (<ProgressiveImage
      imageId={this.props.photo.id}
      previewPath={'thumb'}
      path={'photo'}
      style={{flex: 1, flexDirection: 'row', height: undefined, width: width, marginBottom: 10}}
      resizeMode={'contain'}
    />)
  }

  render () {
    return (
      <View style={styles.bodyContainer}>
        <StatusBar hidden />
        {this.renderImage()}
        <View style={styles.photoDetails}>
          <View style={styles.detailItem}>
            <Image style={styles.iconLocation} source={require('./statics/icon-location.png')}/>
            <Text style={styles.detailText}>Earth</Text>
          </View>
          <View style={[styles.detailItem, {marginLeft: 24, flexGrow: 1}]}>
            <Image style={styles.iconCalendar} source={require('./statics/icon-calendar.png')}/>
            <Text style={styles.detailText}>{this.props.date}</Text>
          </View>
          <Image style={styles.iconInfo} source={require('./statics/icon-info.png')}/>
        </View>
        <ScrollView style={styles.contentContainer}>
          <Text style={styles.threadsTitle}>
            {this.props.threadsIn.length > 0 ? 'This photo appears in the following threads:' : 'You haven\'t shared this photo anywhere yet'}
          </Text>
          {this.props.threadsIn.map((thread, i) => (
            <TouchableOpacity  key={i} onPress={() => { this.viewThread(thread) }}>
              <PhotoWithTextBox key={i} text={thread.name} item={this.props.thumbs[thread.id]}/>
            </TouchableOpacity>
          ))}
          { this.props.threadsIn.length > 0 && <TouchableOpacity onPress={() => { this.createThread() }}>
            <PhotoBoxEmpty style={{marginBottom: 9, marginTop: 0}}/>
          </TouchableOpacity> }
        </ScrollView>
        {this.state.drawer && <BottomDrawerPhotos isVisible selector={this.shareIntoThread.bind(this)} threads={this.props.threadsNotIn} createThread={() => this.createThread()} thumbs={this.props.thumbs} onClose={() => this.shareClosed()}/>}
      </View>
    )
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    authorShare: (imageId) => { dispatch(UIActions.authorPhotoShareRequest(imageId)) },
    shareImage: (imageId) => { dispatch(UIActions.authorPhotoShareRequest(imageId)) }
  }
}

const mapStateToProps = (state, ownProps) => {
  const thread = state.threads.threads.find(thread => thread.id === state.ui.viewingPhoto.threadId)
  const item = state.ipfs.threads[state.ui.viewingPhoto.threadId].items[state.ui.viewingPhoto.index]

  // Used to generate lists of which Threads the image is and
  // which Threads you might want to share the image to
  let containingThreads = []
  // Used to pick the thumb to show beside each thread
  const thumbs = {}
  for (let t in state.ipfs.threads) {
    if (state.ipfs.threads[t].items.length > 0) {
      thumbs[t] = state.ipfs.threads[t].items[state.ipfs.threads[t].items.length - 1]
    }
    if (state.ipfs.threads[t].items.find(i => i.metadata.name === item.metadata.name)) {
      containingThreads.push(t)
    }
  }

  let threadsNotIn = state.threads.threads.filter(t => containingThreads.indexOf(t.id) < 0 && t.name !== 'default').map(t => { return {...t, size: state.ipfs.threads[t.id].items.length} }).sort((a, b) => b - a)


  const path = thread.name === 'default' ? '/photo' : '/thumb'
  return {
    ...item,
    date: item.metadata.added.split('T')[0],
    key: item.photo.id + path,
    source: {url: 'file://' + item.photo.id + '.png'}, // <-- in case RN uses to know things
    // TODO: real dimensions are in the metadata alread now
    dimensions: { width: 150, height: 150 },
    displayImages: state.ipfs.nodeState.state === 'started',
    currentIndex: state.ui.viewingPhoto.index,
    threadsIn: state.threads.threads.filter(t => containingThreads.indexOf(t.id) > -1 && t.name !== 'default'),
    threadsNotIn,
    thumbs
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PhotoDetail)

