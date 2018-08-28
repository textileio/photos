import React from 'react'
import { Keyboard, EmitterSubscription } from 'react-native'

import CommentBox from './CommentBox'

type Props = {
  onUpdate: (text: string) => void
  onSubmit: () => void
}

type State = {
  keyboardHeight: number
}

class CommentBoxContainer extends React.Component<Props, State> {

  keyboardDidShowListener: EmitterSubscription | undefined
  keyboardDidHideListener: EmitterSubscription | undefined

  constructor (props: Props) {
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
    if (this.keyboardDidShowListener) {
      this.keyboardDidShowListener.remove()
    }
    if (this.keyboardDidHideListener) {
      this.keyboardDidHideListener.remove()
    }
  }

  render () {
    return (
      <CommentBox keyboardHeight={this.state.keyboardHeight} {...this.props} />
    )
  }
}

export default CommentBoxContainer