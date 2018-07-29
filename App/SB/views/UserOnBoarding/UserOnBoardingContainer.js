import React from 'react'
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

  render () {
    const { step } = this.state

    return (
      <UserOnBoarding
        {...this.props}
        step={step}
        onNextStep={this.onNextStep}
        onPreviousStep={this.onPreviousStep}
      />
    )
  }
}

export default UserOnBoardingContainer