import React from 'react'
import SignIn from './SignIn'

class SignInContainer extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      username: '',
      password: ''
    }
  }

  onChange = ({ name, value }) => {
    this.setState({
      [name]: value
    })
  }

  render () {
    const { username, password } = this.state

    return (
      <SignIn
        {...this.props}
        username={username}
        password={password}
        onChange={this.onChange}
      />
    )
  }
}

export default SignInContainer