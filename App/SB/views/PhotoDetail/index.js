import React, {Component} from 'react'
import { connect } from 'react-redux'
import { View, Text, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native'
import ImageSc from 'react-native-scalable-image'

import ProgressiveImage from '../../../Components/ProgressiveImage'

import Toolbar from '../../components/Toolbar'
import BottomDrawerPhotos from '../../components/BottomDrawerPhotos'
import PhotoWithTextBox from '../../components/PhotoWithTextBox'
import PhotoBoxEmpty from '../../components/PhotoBoxEmpty'

import styles from './statics/styles'
import { photoList } from './constants'
import UIActions from '../../../Redux/UIRedux'
const { width } = Dimensions.get('window')

class PhotoDetail extends Component {
  constructor (props) {
    super(props)
    console.log(props)
    this.state = {
      drawer: false
    }
  }

  dismissPressed () {
    // TODO
    // This one dispatches an action to clear the state of the viewed photo
    this.props.dismiss()
    // This is actually dismissing the modal since we have no way to do that from a saga or otherwise
    this.props.screenProps.dismiss()
  }

  renderImage () {
    return (<ProgressiveImage
      imageId={this.props.photo.id}
      previewPath={'thumb'}
      path={'photo'}
      style={{flex: 1, flexDirection: 'row', height: undefined, width: undefined}}
      resizeMode={'cover'}
    />)
  }

  get backButton () {
    return (
      <TouchableOpacity onPress={this.dismissPressed.bind(this)}>
        <Image
          style={styles.toolbarLeft}
          source={require('./statics/icon-arrow-left.png')}
        />
      </TouchableOpacity>
    )
  }
  render () {
    return (
      <View style={styles.container}>
        <Toolbar
          style={styles.toolbar}
          left={this.backButton}
          right={
            <View style={styles.toolbarIconsList}>
              <Image style={styles.toolbarAddIcon} source={require('./statics/icon-add.png')}/>
              <Image style={styles.toolbarDownloadIcon} source={require('./statics/icon-download.png')}/>
              <Image style={styles.toolbarShareIcon} source={require('./statics/icon-share.png')}/>
              <Image style={styles.toolbarRemoveIcon} source={require('./statics/icon-remove.png')}/>
            </View>
          }
        />
        {this.renderImage()}
        {/*<ImageSc width={width} source={require('./statics/photo3.png')}/>*/}
        <View style={styles.photoDetails}>
          <View style={styles.detailItem}>
            <Image style={styles.iconLocation} source={require('./statics/icon-location.png')}/>
            <Text style={styles.detailText}>San Francisco</Text>
          </View>
          <View style={[styles.detailItem, {marginLeft: 24, flexGrow: 1}]}>
            <Image style={styles.iconCalendar} source={require('./statics/icon-calendar.png')}/>
            <Text style={styles.detailText}>20/03/2018</Text>
          </View>
          <Image style={styles.iconInfo} source={require('./statics/icon-info.png')}/>
        </View>
        <ScrollView style={styles.contentContainer}>
          <Text style={styles.threadsTitle}>This photo appears in the following threads:</Text>
          <PhotoWithTextBox text='San Francisco' photo={require('./statics/photo1.png')}/>
          <PhotoWithTextBox text='San Francisco' photo={require('./statics/photo2.png')}/>
          <PhotoBoxEmpty style={{marginBottom: 9, marginTop: 0}}/>
        </ScrollView>
        {this.state.drawer && <BottomDrawerPhotos list={photoList}/>}
      </View>
    )
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
    dismiss: () => { dispatch(UIActions.dismissViewedPhoto()) }
  }
}

const mapStateToProps = (state, ownProps) => {
  console.log(state.ui.viewingPhoto)
  const thread = state.threads.threads.find(thread => thread.id === state.ui.viewingPhoto.threadId)
  const item = state.ipfs.threads[state.ui.viewingPhoto.threadId].items[state.ui.viewingPhoto.index]
  const path = thread.name === 'default' ? '/photo' : '/thumb'
  return {
    ...item,
    key: item.photo.id + path,
    source: {url: 'file://' + item.photo.id + '.png'}, // <-- in case RN uses to know things
    dimensions: { width: 150, height: 150 },
    displayImages: state.ipfs.nodeState.state === 'started',
    currentIndex: state.ui.viewingPhoto.index
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PhotoDetail)

