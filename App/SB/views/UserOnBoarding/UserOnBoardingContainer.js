import React from 'react'
import { connect } from 'react-redux'

import UserOnBoarding from './UserOnBoarding'

import UIActions from '../../../Redux/UIRedux'

class UserOnBoardingContainer extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      step: 0
    }
  }

  onNextStep = () => {
    const { step } = this.state

    this.setState({
      step: step + 1
    })
  }

  onPreviousStep = () => {
    const { step } = this.state

    this.setState({
      step: step - 1
    })
  }

  render () {
    const { step } = this.state

    return (
      <UserOnBoarding
        {...this.props}
        step={step}
        onNextStep={this.props.chooseProfilePicture}
        onPreviousStep={this.onPreviousStep}
      />
    )
  }
}

const mapStateToProps = state => {
  return {
    username: state.auth.username || 'Mysterious User',
    profilePictureData: state.ui.chosenProfilePhoto.data
  }
}

const mapDispatchToProps = dispatch => {
  return {
    chooseProfilePicture: () => dispatch(UIActions.chooseProfilePhotoRequest())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserOnBoardingContainer)