import React, { Component } from 'react'
import { connect } from 'react-redux'
import { TextInput, View, FlatList, ScrollView, Text, TouchableOpacity } from 'react-native'
import UIActions from '../Redux/UIRedux'
import Icon from 'react-native-vector-icons/Ionicons'
import Colors from '../Themes/Colors'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'
import Config from "react-native-config"

// Styles
import styles from './Styles/CommentStyle'

class Comment extends React.PureComponent {
  _onSubmit = () => {
    this.props.share(this.props.threads, this.props.hash, this.props.comment)
    this.props.close()
  }

  _onTextChange = text => {
    this.props.updateComment(text)
  }

  render () {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          multiline={true}
          placeholder={'Add a comment'}
          onChangeText={this._onTextChange}
        />
        <TouchableOpacity onPress={this._onSubmit}>
          <View style={styles.button}>
            <Text style={styles.buttonText}>
              {'Share'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    hash: state.ui.sharingPhoto.hash,
    comment: state.ui.sharingPhoto.comment,
    threads: Array.from(state.ui.sharingPhoto.selectedThreads.entries())
      .filter(entry => entry[1] === true)
      .map(entry => entry[0])
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    share: (threads, hash, comment) => { dispatch(UIActions.sharePhotoRequest(threads, hash, comment)) },
    close: () => { dispatch(UIActions.cancelAuthoringPhotoShare()) },
    updateComment: (text) => { dispatch(UIActions.updateComment(text)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Comment)
