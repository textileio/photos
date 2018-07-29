import React, {Component} from 'react'
import { connect } from 'react-redux'
import { ScrollView, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native'

import PhotoWithTextBox from '../../components/PhotoWithTextBox'
import PhotoBoxEmpty from '../../components/PhotoBoxEmpty'
import Modal from 'react-native-modal'

import styles from './statics/styles'


// via https://github.com/react-native-community/react-native-modal/issues/147
const WIDTH = Dimensions.get('window').width

// May be slightly off on some bigger Android devices...
const HEIGHT = Dimensions.get('window').height

class BottomDrawerPhotos extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isVisible: true
    }
  }

  render () {
    return (
      <Modal isVisible animationIn={'fadeInUp'} animationOut={'fadeOutDown'} avoidKeyboard backdropColor={'#E1E1E1'} backdropOpacity={0.5} style={{width: WIDTH, height: HEIGHT, margin: 0, padding: 0}}>
        <View style={styles.container} >
          <View style={styles.header}>
            <Text style={styles.title}>Share this photo in:</Text>
            <TouchableOpacity onPress={ () => {
              this.props.onClose()
            }}>
              <Image style={styles.closeIcon} source={require('./statics/icon-cancel.png')}/>
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.listContainer}>
            {this.props.threads.map((thread, i) => (
              <TouchableOpacity  key={i} onPress={() => {
                this.props.selector(i)
              }}>
                <PhotoWithTextBox style={styles.photoElement} item={this.props.thumbs[thread.id]} text={thread.name} />
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => {
              this.props.createThread()
            }}>
              <PhotoBoxEmpty />
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>
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

