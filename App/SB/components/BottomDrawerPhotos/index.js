import React, {Component} from 'react'
import { connect } from 'react-redux'
import { View, Text, Image, TouchableOpacity } from 'react-native'

import Drawer from '../../components/BottomDrawer'
import PhotoWithTextBox from '../../components/PhotoWithTextBox'
import PhotoBoxEmpty from '../../components/PhotoBoxEmpty'

import styles from './statics/styles'
import UIActions from '../../../Redux/UIRedux'

class BottomDrawerPhotos extends Component {
  constructor (props) {
    super(props)
  }

  render () {
    return (
      <Drawer overlay style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Share this photo in:</Text>
          <TouchableOpacity onPress={ () => { this.props.onClose() }}>
            <Image style={styles.closeIcon} source={require('./statics/icon-cancel.png')}/>
          </TouchableOpacity>
        </View>
        <View style={styles.listContainer}>
          {this.props.threads.map((thread, i) => (
            <TouchableOpacity  key={i} onPress={() => { this.props.selector(i) }}>
              <PhotoWithTextBox style={styles.photoElement} item={this.props.thumbs[thread.id]} text={thread.name} />
            </TouchableOpacity>
          ))}
          <TouchableOpacity onPress={() => { this.props.seeMore() }}>
            <PhotoBoxEmpty text={'See more threads'} />
          </TouchableOpacity>
        </View>
      </Drawer>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(BottomDrawerPhotos)

