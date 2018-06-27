// @flow
import React from 'react'
import { requireNativeComponent, ViewPropTypes } from 'react-native'

type Props = {
  imageId: string,
  path: string,
  resizeMode: string,
  onLoad?: () => void,
  onError?: (any) => void
}

export default class TextileImage extends React.Component<Props, *> {
  static defaultProps = {}

  constructor (props: Props) {
    super(props)
  }

  render () {
    return <TextileImageView {...this.props} />
  }
}

const TextileImageView = requireNativeComponent('TextileImageView', TextileImage)
