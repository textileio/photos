import React, {Component} from 'react'
import { connect } from 'react-redux'
import { View, Text, Image, ScrollView, Dimensions, StatusBar, TouchableOpacity } from 'react-native'
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
    this.state = {
      drawer: false
    }
  }
  static navigationOptions = ({ navigation }) => {

    {/*<Toolbar*/}
      {/*left={<Image style={styles.toolbarLeft} source={require('./statics/icon-arrow-left.png')} />}*/}
      {/*right={*/}
        {/*<View style={styles.toolBarRight}>*/}
          {/*<Image style={styles.toolbarIconMore} source={require('./statics/icon-more.png')} />*/}
        {/*</View>*/}
      {/*}>*/}
      {/*<Text style={styles.toolbarTitle}>Summer cheers!!! </Text>*/}
    {/*</Toolbar>*/}


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
      headerRight,
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
        <StatusBar hidden />
        <ScrollView style={styles.contentContainer}>

          {this.renderImage()}
          {/*<ImageSc style={styles.mainPhoto} width={width} source={require('./statics/photo2.png')}/>*/}
          <View style={styles.commentsContainer}>
            {this.props.comments.map((comment, i) => (
              <CommentCard key={i} {...comment} />
            ))}
          </View>
        </ScrollView>
        <CommentBox/>
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
  const thread = state.threads.threads.find(thread => thread.id === state.ui.viewingPhoto.threadId)
  const item = state.ipfs.threads[state.ui.viewingPhoto.threadId].items[state.ui.viewingPhoto.index]
  return {
    ...item,
    comments: [item]
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreadPhotoDetail)
