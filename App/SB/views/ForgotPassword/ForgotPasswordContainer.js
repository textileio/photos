import React from 'react'
import ForgotPassword from './ForgotPassword'

class ForgotPasswordContainer extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      email: ''
    }
  }

  onChange = ({ name, value }) => {
    this.setState({
      [name]: value
    })
  }

  render () {
    const { email } = this.state

    return (
      <ForgotPassword
        {...this.props}
        email={email}
        onChange={this.onChange}
      />
    )
  }
}

export default ForgotPasswordContainer
