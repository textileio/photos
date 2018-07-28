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
      headerTitle: undefined,
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
            buttonStyle={{backgroundColor: 'rgba(0,0,0,0)'}}
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
      close: () => { this.props.close() },
      submit: () => { this._share(this.state.value) },
      submitEnabled: false
    })
  }

  _share (comment) {
    this.props.share(this.props.navigation.state.params.photo.id, [this.props.navigation.state.params.thread.id], comment)
    this.props.close()
    this.props.navigation.goBack()
  }

  render () {
    return (
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Photo caption</Text>
          <Input labelStyle={{
            color: '#9b9b9b',
            fontSize: 16
          }} label={this.state.value === '' ? 'Add a caption...' : ''} onChangeText={this.handleNewText}/>
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
    // submit: (name: string) => { dispatch(ThreadsActions.addThreadRequest(name)) }
    share: (hash, threads, comment) => { dispatch(UIActions.sharePhotoRequest(hash, threads, comment)) },
    close: () => { dispatch(UIActions.cancelAuthoringPhotoShare()) },
    updateComment: (text) => { dispatch(UIActions.updateComment(text)) }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCaptionScreen)
