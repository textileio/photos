import React, { Component } from 'react'
import { connect } from 'react-redux'
import { TextInput, View, FlatList, ScrollView, Text, TouchableOpacity } from 'react-native'
import UIActions from '../Redux/UIRedux'
import Icon from 'react-native-vector-icons/Ionicons'
import Colors from '../Themes/Colors'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Styles
import styles from './Styles/CommentStyle'

class Comment extends React.PureComponent {
  _onSubmit = () => {
    this.props.cancelShare()
  }

  render () {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textInput}
          multiline={true}
          placeholder={'Add a comment'}
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
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    cancelShare: () => { dispatch(UIActions.cancelAuthoringPhotoShare()) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Comment)
