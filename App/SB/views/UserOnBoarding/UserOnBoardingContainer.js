import React from 'react'
import { connect } from 'react-redux'

import UserOnBoarding from './UserOnBoarding'

import UIActions from '../../../Redux/UIRedux'

class UserOnBoardingContainer extends React.Component {
  render () {
    return (
      <UserOnBoarding
        {...this.props}
        chooseProfilePicture={this.props.chooseProfilePicture}
        selectProfilePicture={this.props.selectProfilePicture}
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
    selectProfilePicture: (uri) => dispatch(UIActions.selectProfilePicture(uri))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserOnBoardingContainer)
