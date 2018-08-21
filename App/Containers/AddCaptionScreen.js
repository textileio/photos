import React from 'react'
import { connect } from 'react-redux'
import { View } from 'react-native'
import { TextileHeaderButtons, Item } from '../Components/HeaderButtons'
import Input from '../SB/components/Input'
import { NavigationActions } from 'react-navigation'
import styles from '../SB/views/ThreadCreate/statics/styles'
import UIActions from '../Redux/UIRedux'

class AddCaptionScreen extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    return {
      headerTitle: 'Photo Caption',
      headerLeft: (
        <TextileHeaderButtons left>
          <Item title='Back' iconName='arrow-left' onPress={() => {
            params.cancelShare()
            navigation.dispatch(NavigationActions.navigate({ routeName: params.backTo }))
          }} />
        </TextileHeaderButtons>
      ),
      headerRight: (
        <TextileHeaderButtons>
          <Item title='Share' onPress={() => {
            params.share()
            navigation.dispatch(NavigationActions.navigate({ routeName: params.backTo }))
          }} />
        </TextileHeaderButtons>
      ),
    }
  }

  handleNewText = (text: string) => {
    this.props.updateComment(text)
  }

  componentWillMount () {
    this.props.navigation.setParams({
      cancelShare: () => { this.props.cancelShare() },
      share: () => { this.props.share(this.props.image, this.props.threadId, this.props.comment) }
    })
  }

  render () {
    return (
        <View style={styles.contentContainer}>
          <Input
            style={{height: 40}}
            value={this.props.comment}
            label='Add a caption...'
            onChangeText={this.handleNewText.bind(this)}
          />
        </View>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const sharingPhoto = state.ui.sharingPhoto || {}
  return {
    image: sharingPhoto.image,
    threadId: sharingPhoto.threadId,
    comment: sharingPhoto.comment
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateComment: (text) => { dispatch(UIActions.updateSharingPhotoComment(text)) },
    share: (image, threadId, comment) => { dispatch(UIActions.sharePhotoRequest(image, threadId, comment)) },
    cancelShare: () => { dispatch(UIActions.cancelSharingPhoto()) },
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCaptionScreen)
