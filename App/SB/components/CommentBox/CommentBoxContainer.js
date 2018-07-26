import React from 'react'
import { Keyboard } from 'react-native'

import CommentBox from './CommentBox'

class CommentBoxContainer extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      keyboardHeight: 0
    }
  }

  componentDidMount () {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow)
    this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardDidHide)
  }

  _keyboardDidShow = e => {
    this.setState({
      keyboardHeight: e.endCoordinates.height,
    })
  }

  _keyboardDidHide = () => {
    this.setState({
      keyboardHeight: 0,
    })
  }

  componentWillUnmount () {
    this.keyboardDidShowListener.remove()
    this.keyboardDidHideListener.remove()
  }


  render () {
    return (
      <CommentBox
        keyboardHeight={this.state.keyboardHeight}
      />
    )
  }
}

export default CommentBoxContainer