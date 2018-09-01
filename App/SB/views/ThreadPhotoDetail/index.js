import React, { Component } from 'react'
import { connect } from 'react-redux'
import { View, ScrollView, Dimensions } from 'react-native'
import { NavigationActions } from 'react-navigation'

import { TextileHeaderButtons, Item } from '../../../Components/HeaderButtons'

import BottomDrawerList from '../../components/BottomDrawerList'
import CommentCard from '../../components/CommentCard'

import ProgressiveImage from '../../../Components/ProgressiveImage'

import styles from './statics/styles'

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
      <TextileHeaderButtons left>
        <Item title='Back' iconName='arrow-left' onPress={() => { navigation.dispatch(NavigationActions.back()) }} />
      </TextileHeaderButtons>
    )
    return {
      headerLeft
    }
  }

  renderImage () {
    const height = width * 1 // avoids lint warning
    return (<ProgressiveImage
      imageId={this.props.photo.id}
      previewPath={'small'}
      path={'photo'}
      style={[styles.mainPhoto, { height }]}
      resizeMode={'contain'}
    />)
  }

  render () {
    return (
      <View style={styles.container}>
        <ScrollView style={styles.contentContainer}>

          {this.renderImage()}
          {/* <ImageSc style={styles.mainPhoto} width={width} source={require('./statics/photo2.png')}/> */}
          <View style={styles.commentsContainer}>
            {this.props.comments.map((comment, i) => (
              <CommentCard key={i} profiles={this.props.profiles} {...comment} />
            ))}
          </View>
        </ScrollView>
        {/* <CommentBox/> */}
        {this.state.drawer && <BottomDrawerList />}
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  const item = state.textileNode.threads[state.ui.viewingPhoto.threadId].items.find((it) => it.photo.id === state.ui.viewingPhoto.photoId)
  return {
    ...item,
    comments: [item],
    profiles: state.contacts.profiles
  }
}

export default connect(mapStateToProps, undefined)(ThreadPhotoDetail)
