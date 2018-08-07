import React from 'react'
import { connect } from 'react-redux'
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native'
import Input from '../SB/components/Input'
import { Button } from 'react-native-elements'
import { NavigationActions } from 'react-navigation'
import navStyles from '../Navigation/Styles/NavigationStyles'
import ThreadsActions from '../Redux/ThreadsRedux'
import styles from '../SB/views/ThreadCreate/statics/styles'
import UIActions from '../Redux/UIRedux'
import CameraRollActions from '../Redux/CameraRollRedux'


class AddCaptionScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      value: ''
    }
  }

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    return {
      headerTitle: 'Photo Caption',
      headerLeft: (
        <TouchableOpacity onPress={ () => {
          params.close()
          navigation.dispatch(NavigationActions.back())
        }}>
          <Image
            style={navStyles.headerLeft}
            source={require('../SB/views/ThreadsDetail/statics/icon-arrow-left.png')}
          />
        </TouchableOpacity>
      ),
      headerRight: params.submitEnabled && (
        <View style={styles.toolBarRight}>
          <Button
            buttonStyle={{backgroundColor: 'rgba(0,0,0,0)', elevation: 0}}
            titleStyle={styles.link}
            onPress={() => params.submit()}
            title={'Next'}
            color='#fff'
          />
        </View>
      ),
    }
  }

  handleNewText = (text: string) => {
    this.setState({ value: text})
    this.props.navigation.setParams({
      close: () => { this.props.close() },
      submit: () => { this._share(this.state.value) },
      submitEnabled: (text.length > 0)
    })
  }

  componentWillMount () {
    this.props.navigation.setParams({
      close: this._close.bind(this),
      submit: () => { this._share(this.state.value) },
      submitEnabled: false
    })
  }

  _close () {
    const params = this.props.navigation.state.params
    if (params.photo) {
      // from the wallet
      this.props.close()
    } else {
      // from the photo picker
      this.props.cancelShare(params.threadId, params.image)
    }
  }

  _share (caption) {
    const params = this.props.navigation.state.params
    if (params.photo) {
      // from the wallet
      this.props.share(params.photo.id, [params.thread.id], caption)
      this.props.close()
      this.props.navigation.goBack()
    } else {
      // from the photo picker
      this.props.addComment(params.threadId, params.image, caption)
      this.props.navigation.goBack()
    }
  }

  render () {
    return (
        <View style={styles.contentContainer}>
          <Input
            style={{height: 40}}
            value={this.state.value}
            label={this.state.value === '' ? 'Add a caption...' : ''}
            onChangeText={this.handleNewText.bind(this)}/>
        </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    sharingPhoto: state.ui.sharingPhoto.active
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateComment: (text) => { dispatch(UIActions.updateComment(text)) },
    // Share from Wallet methods
    share: (hash, threads, caption) => { dispatch(UIActions.sharePhotoRequest(hash, threads, caption)) },
    close: () => { dispatch(UIActions.cancelAuthoringPhotoShare()) },
    // Share from CameraRoll methods
    addComment: (threadId, image, caption) => { dispatch(CameraRollActions.addComment(threadId, image, caption)) },
    cancelShare: (threadId, image) => { dispatch(CameraRollActions.cancelShare(threadId, image)) },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCaptionScreen)
