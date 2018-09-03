import React from 'react'
import propTypes from 'prop-types'

import PasswordValidator from './PasswordValidator'

class PasswordValidatorContainer extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      condition: 'Weak'
    }
  }

  componentWillUpdate (oldProps) {
    if (oldProps !== this.props) {
      this.onValidate(oldProps.password)
    }
  }

  onValidate = text => {
    text // TODO: really dumb implementation
      .split('')
      .map(letter => {
        if ('!@#$%^&*()'.includes(letter)) {
          this.setState({
            condition: 'Strong'
          })
        }

        if ('1234567890'.includes(letter)) {
          this.setState({
            condition: 'Normal'
          })
        }

        if ('qwertyuiopasdfghjklzxcvbnm'.includes(letter)) {
          this.setState({
            condition: 'Weak'
          })
        }
      })
  }

  render () {
    return (
      <PasswordValidator
        {...this.props}
        text={this.state.condition}
        onValidate={this.onValidate}
      />
    )
  }
}

PasswordValidatorContainer.propTypes = {
  password: propTypes.string
}

export default PasswordValidatorContainer
