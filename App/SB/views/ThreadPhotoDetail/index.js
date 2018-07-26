import React, {Component} from 'react'
import { connect } from 'react-redux'
import { View, Text, ScrollView, Dimensions, Image } from 'react-native'
import ImageSc from 'react-native-scalable-image'

import Toolbar from '../../components/Toolbar'
import BottomDrawerList from '../../components/BottomDrawerList'
import CommentCard from '../../components/CommentCard'
import CommentBox from '../../components/CommentBox/CommentBoxContainer'

import styles from './statics/styles'
import comments from './constants'
import UIActions from '../../../Redux/UIRedux'

const { width } = Dimensions.get('window')

class ThreadPhotoDetail extends Component {
  constructor (props) {
    super(props)
    console.log(props)
    this.state = {
      drawer: false
    }
  }
  static navigationOptions = ({ navigation }) => {
    return {
      // headerRight,
      tabBarVisible: false
    }
  }

  // const showDrawer = false // Should uncomment to display drawer

  render () {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.contentContainer}>
          <ImageSc style={styles.mainPhoto} width={width} source={require('./statics/photo2.png')}/>
          <View style={styles.commentsContainer}>
            {this.props.comments.map((comment, i) => (
              <CommentCard key={i} {...comment} />
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
  const thread = state.threads.threads.find(thread => thread.id === state.ui.viewingPhoto.threadId)
  const item = state.ipfs.threads[state.ui.viewingPhoto.threadId].items[state.ui.viewingPhoto.index]
  return {
    comments: [item]
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ThreadPhotoDetail)
