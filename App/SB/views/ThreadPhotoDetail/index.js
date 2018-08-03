import React, {Component} from 'react'
import { connect } from 'react-redux'
import { View, Text, Image, ScrollView, Dimensions, TouchableOpacity } from 'react-native'
import ImageSc from 'react-native-scalable-image'
import { NavigationActions } from 'react-navigation';

import Toolbar from '../../components/Toolbar'
import BottomDrawerList from '../../components/BottomDrawerList'
import CommentCard from '../../components/CommentCard'
import CommentBox from '../../components/CommentBox/CommentBoxContainer'

import ProgressiveImage from '../../../Components/ProgressiveImage'

import styles from './statics/styles'
import comments from './constants'
import UIActions from '../../../Redux/UIRedux'

const { width } = Dimensions.get('window')

class ThreadPhotoDetail extends Component {
  constructor (props) {
    super(props)
    const heightByWidth = (this.props.metadata.height / this.props.metadata.width) * width
    this.state = {
      drawer: false,
      heightByWidth
    }
  }
  static navigationOptions = ({ navigation }) => {
    const headerLeft = (
      <TouchableOpacity onPress={ () => { navigation.dispatch(NavigationActions.back()) }}>
        <Image style={styles.toolbarLeft} source={require('./statics/icon-arrow-left.png')} />
      </TouchableOpacity>
    )
    const headerRight = (
        <TouchableOpacity style={styles.toolBarRight}>
          <Image style={styles.toolbarIconMore} source={require('./statics/icon-more.png')} />
        </TouchableOpacity>
    )

    return {
      headerLeft,
      // headerRight,
      tabBarVisible: false
    }
  }

  renderImage () {
    return (<ProgressiveImage
      imageId={this.props.photo.id}
      previewPath={'thumb'}
      path={'photo'}
      style={[styles.mainPhoto, {height: width}]}
      resizeMode={'contain'}
    />)
  }

  render () {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.contentContainer}>

          {this.renderImage()}
          {/*<ImageSc style={styles.mainPhoto} width={width} source={require('./statics/photo2.png')}/>*/}
          <View style={styles.commentsContainer}>
            {this.props.comments.map((comment, i) => (
              <CommentCard key={i} profiles={this.props.profiles} {...comment} />
            ))}
          </View>
        </ScrollView>
        {/*<CommentBox/>*/}
        {this.state.drawer && <BottomDrawerList/>}
      </View>
    )
  }
}


const mapDispatchToProps = (dispatch) => {
  return {
  }
}

const mapStateToProps = (state, ownProps) => {
  const item = state.textileNode.threads[state.ui.viewingPhoto.threadId].items.find((it) => it.photo.id === state.ui.viewingPhoto.photoId)
  return {
    ...item,
    comments: [item],
    profiles: state.contacts.profiles
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreadPhotoDetail)
