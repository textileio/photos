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

  _imageLoaeded (event: Event) {
    console.log('Image loaded')
    if (!this.props.onLoad) {
      return
    }
    this.props.onLoad()
  }

  _imageError (event: Event) {
    console.log('Image error')
    if (!this.props.onError) {
      return
    }
    this.props.onError(event.nativeEvent.message)
  }

  render () {
    return <TextileImageView {...this.props} imageLoaded={this._imageLoaeded.bind(this)} imageError={this._imageError.bind(this)} />
  }
}

const TextileImageView = requireNativeComponent('TextileImageView', TextileImage, {
  nativeOnly: {imageLoaded: true, imageError: true}
})
