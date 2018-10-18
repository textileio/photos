import React from 'react'
import { connect } from 'react-redux'

import UserOnBoarding from './UserOnBoarding'

import { TextileHeaderButtons, Item } from '../../../Components/HeaderButtons'
import { NavigationActions } from 'react-navigation'

import UIActions from '../../../Redux/UIRedux'

class UserOnBoardingContainer extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const params = navigation.state.params || {}
    return {
      headerLeft: (
        <TextileHeaderButtons left>
          <Item title='Back' iconName='arrow-left' onPress={() => {
            params.cancelProfileUpdate()
            if (params.backTo) {
              navigation.dispatch(NavigationActions.navigate({ routeName: params.backTo }))
            } else {
              navigation.dispatch(NavigationActions.back())
            }
          }} />
        </TextileHeaderButtons>
      )
    }
  }

  componentWillMount () {
    this.props.navigation.setParams({
      cancelProfileUpdate: this.props.cancelProfileUpdate
    })
  }

  render () {
    return (
      <UserOnBoarding
        {...this.props}
        chooseProfilePicture={this.props.chooseProfilePicture}
        selectProfilePicture={this.props.updateProfilePicture}
      />
    )
  }
}

const mapStateToProps = state => {
  return {
    username: state.auth.username || 'Mysterious User',
    profilePictureData: state.ui.chosenProfilePhoto.data,
    profilePictureUri: state.ui.chosenProfilePhoto.uri
  }
}

const mapDispatchToProps = dispatch => {
  return {
    chooseProfilePicture: () => dispatch(UIActions.chooseProfilePhotoRequest()),
    updateProfilePicture: (uri) => dispatch(UIActions.updateProfilePicture(uri)),
    cancelProfileUpdate: () => dispatch(UIActions.cancelProfileUpdate())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserOnBoardingContainer)
