import React from 'react'
import { requireNativeComponent, ImageStyle, PixelRatio } from 'react-native'
import { PhotoId } from '../Models/TextileTypes'

export interface Props {
  imageId: PhotoId,
  forMinWidth: number,
  resizeMode: string,
  capInsets?: string,
  style?: ImageStyle | ImageStyle[],
  onLoad?: () => void,
  onError?: (error: string) => void
}

export default class TextileImage extends React.Component<Props> {
  static propTypes = {}
  static defaultProps = {}
  _onLoaded () {
    if (!this.props.onLoad) {
      return
    }
    this.props.onLoad()
  }

  _onError (event: any) {
    // TODO: need the real type for Event here...
    if (!this.props.onError || !event.nativeEvent || !event.nativeEvent.message) {
      return
    }
    this.props.onError(event.nativeEvent.message)
  }

  render () {
    const nativeProps = {
      ...this.props,
      forMinWidth: PixelRatio.getPixelSizeForLayoutSize(this.props.forMinWidth),
      onLoad: this._onLoaded.bind(this),
      onError: this._onError.bind(this)
    }
    return <TextileImageView {...nativeProps} />
  }
}

const TextileImageView = requireNativeComponent('TextileImageView', TextileImage)
