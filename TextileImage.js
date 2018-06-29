// @flow
import React from 'react'
import { requireNativeComponent, ViewPropTypes } from 'react-native'

type Props = {
  imageId: string,
  path: string,
  resizeMode: string,
  onLoad?: () => void,
  onError?: (string) => void
}

export default class TextileImage extends React.Component<Props, *> {
  static defaultProps = {}

  constructor (props: Props) {
    super(props)
  }

  _onLoaded (event) {
    if (!this.props.onLoad) {
      return
    }
    this.props.onLoad()
  }

  _onError (event) {
    if (!this.props.onError) {
      return
    }
    this.props.onError(event.nativeEvent.message)
  }

  render () {
    const nativeProps = {
      ...this.props,
      onLoad: this._onLoaded.bind(this),
      onError: this._onError.bind(this)
    }
    return <TextileImageView {...nativeProps} />
  }
}

const TextileImageView = requireNativeComponent('TextileImageView', TextileImage)
