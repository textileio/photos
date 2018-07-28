import React from 'react'
import SignUp from './SignUp'

class SignUpContainer extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      step: 0,
      name: '',
      email: '',
      username: '',
      password: ''
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

  onChange = ({ name, value }) => {
    this.setState({
      [name]: value
    })
  }

  render () {
    return (
      <SignUp
        {...this.props}
        {...this.state}
        onNextStep={this.onNextStep}
        onPreviousStep={this.onPreviousStep}
        onChange={this.onChange}
      />
    )
  }
}

export default SignUpContainer