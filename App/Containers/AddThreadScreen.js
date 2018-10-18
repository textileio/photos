import React from 'react'
import { connect } from 'react-redux'
import { View, ScrollView } from 'react-native'
import Input from '../SB/components/Input'
import { NavigationActions } from 'react-navigation'
import { TextileHeaderButtons, Item } from '../Components/HeaderButtons'
import PhotoViewingActions from '../Redux/PhotoViewingRedux'
import styles from '../SB/views/ThreadCreate/statics/styles'

class AddThreadScreen extends React.Component {
  state = {
    value: '',
    submitted: false
  }

  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    const title = params.withPhoto ? 'Next' : 'Create'
    // default to true
    const selectForShare = !!params.selectForShare
    return {
      headerTitle: 'New Thread',
      headerLeft: (
        <TextileHeaderButtons left>
          <Item title='Back' iconName='arrow-left' onPress={() => {
            if (params.backTo) {
              navigation.dispatch(NavigationActions.navigate({ routeName: params.backTo }))
            } else {
              navigation.dispatch(NavigationActions.back())
            }
          }} />
        </TextileHeaderButtons>
      ),
      headerRight: params.submitEnabled ? (
        <TextileHeaderButtons>
          <Item title={title} onPress={() => {
            if (params.withPhoto) {
              // With photo indicates that we are creating the thread already having a photo to share to it
              params.submitWithPhoto(params.withPhoto)
            } else {
              params.submit(selectForShare)
            }
          }} />
        </TextileHeaderButtons>
      ) : (<View />) // ensure spacing in android
    }
  }

  handleNewText = (text) => {
    this.setState({ value: text })
    this.props.navigation.setParams({
      submitEnabled: (text.length > 0)
    })
  }

  componentWillMount () {
    this.props.navigation.setParams({
      submit: this._submit.bind(this),
      submitEnabled: false,
      submitWithPhoto: this._submitWithPhoto.bind(this)
    })
  }

  _submitWithPhoto (withPhoto) {
    // This is when you are creating a new thread for a photo selected in the wallet
    const withThreadName = this.state.value
    this.props.navigation.navigate('WalletSharePhoto', { backTo: 'PrivatePhotoDetail', withPhoto, withThreadName })
  }

  _submit (selectForShare) {
    if (selectForShare) {
      this.props.submit(this.state.value, false, true)
      this.props.navigation.navigate('ThreadSharePhoto', {backTo: 'SharedPhotos'})
    } else {
      this.props.submit(this.state.value, true, false)
      this.props.navigation.goBack()
    }
  }

  render () {
    return (
      <ScrollView style={styles.contentContainer}>
        <View>
          <Input
            style={{ height: 40 }}
            value={this.state.value}
            label={this.state.value === '' ? 'Add a title...' : ''}
            onChangeText={this.handleNewText.bind(this)} />
        </View>
      </ScrollView>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    submit: (name, navigate, selectToShare) => { dispatch(PhotoViewingActions.addThreadRequest(name, { navigate, selectToShare })) }
  }
}

export default connect(undefined, mapDispatchToProps)(AddThreadScreen)
