import React, { Component } from 'react'
import { View, Text, FlatList, TouchableHighlight } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import { connect } from 'react-redux'
import SharingNavigation from '../Navigation/SharingNavigation'
import AsyncImage from '../Components/AsyncImage'

// Add Actions - replace 'Your' with whatever your reducer is called :)
import UIActions from '../Redux/UIRedux'

// Styles
import styles from './Styles/SharingDialogStyle'

class SharingDialog extends Component {
  render () {
    return (
      <View style={styles.container}>
        <AsyncImage
          hash={this.props.hash}
          path={'/thumb'}
          containerStyle={{height: '33%'}}
          style={{flex: 1, height: undefined, width: undefined}}
          resizeMode={'cover'}
          displayImages={this.props.displayImages}
        />
        <TouchableHighlight
          underlayColor={'transparent'}
          style={{alignItems: 'center', position: 'absolute', top: 0, right: 0, width: 44, height: 44}}
          onPress={this.props.cancelAuthoringShare}
        >
          <Icon name={'ios-close'} size={44} color={'white'} />
        </TouchableHighlight>
        <SharingNavigation style={{flex: 1}} />
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    hash: state.ui.sharingPhoto.hash,
    displayImages: state.ipfs.nodeState.state === 'started'
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    cancelAuthoringShare: () => { dispatch(UIActions.cancelAuthoringPhotoShare()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SharingDialog)
