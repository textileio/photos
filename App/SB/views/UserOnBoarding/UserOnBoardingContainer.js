import React from 'react'
import { connect } from 'react-redux'

import UserOnBoarding from './UserOnBoarding'

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

  showPicker = () => {
    
  }

  render () {
    const { step } = this.state

    return (
      <UserOnBoarding
        {...this.props}
        step={step}
        onNextStep={this.showPicker}
        onPreviousStep={this.onPreviousStep}
      />
    )
  }
}

const mapStateToProps = state => {
  return {
    username: state.auth.username || 'Mysterious User'
  }
}

const mapDispatchToProps = dispatch => {
  return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(UserOnBoardingContainer)