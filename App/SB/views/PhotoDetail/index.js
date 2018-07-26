import React, {Component} from 'react'
import { connect } from 'react-redux'
import { NavigationActions } from 'react-navigation';
import { View, Text, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native'

import ProgressiveImage from '../../../Components/ProgressiveImage'

import BottomDrawerPhotos from '../../components/BottomDrawerPhotos'
import PhotoWithTextBox from '../../components/PhotoWithTextBox'
import PhotoBoxEmpty from '../../components/PhotoBoxEmpty'

import styles from './statics/styles'
import toolbarStyle from '../../components/Toolbar/statics/styles'

import { photoList } from './constants'

const { width } = Dimensions.get('window')

class PhotoDetail extends Component {
  constructor (props) {
    super(props)
    this.state = {
      drawer: false
    }
  }

  static navigationOptions = ({ navigation }) => {
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
          <Image style={styles.toolbarAddIcon} source={require('./statics/icon-add.png')}/>
          <Image style={styles.toolbarDownloadIcon} source={require('./statics/icon-download.png')}/>
          <Image style={styles.toolbarShareIcon} source={require('./statics/icon-share.png')}/>
          <Image style={styles.toolbarRemoveIcon} source={require('./statics/icon-remove.png')}/>
        </View>
    )

    return {
      headerStyle: styles.toolBar,
      headerTintColor: styles.container.backgroundColor,
      headerRight,
      headerLeft,
      tabBarVisible: false
    }
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
        {this.renderImage()}
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
  }
}

const mapStateToProps = (state, ownProps) => {
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

