import React, { Component } from 'react'
import { connect } from 'react-redux'
import { ScrollView, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native'

import Modal from 'react-native-modal'

import styles from './statics/styles'

const WIDTH = Dimensions.get('window').width

// may be off on some Android devices
const HEIGHT = Dimensions.get('window').height

// Placeholder made by AXH without any SB stuff
class PermissionsInfo extends Component {
  constructor (props) {
    super(props)
    this.state = {
      isVisible: true
    }
  }

  render () {
    return (
      <Modal
        isVisible
        animationIn={'fadeInUp'}
        animationOut={'fadeOutDown'}
        avoidKeyboard backdropColor={'#E1E1E1'}
        backdropOpacity={0.5} style={{ width: WIDTH, height: HEIGHT, margin: 0, padding: 0 }}
      >
        <View style={styles.container} >
          <View style={styles.header}>
            <Text style={styles.title}>{this.props.info.title}</Text>
            <TouchableOpacity onPress={this.props.close}>
              <Image style={styles.closeIcon} source={require('./statics/icon-cancel.png')} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.detailsContainer}>
            <Text style={styles.details}>{this.props.info.details}</Text>
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

export default connect(mapStateToProps, mapDispatchToProps)(PermissionsInfo)
