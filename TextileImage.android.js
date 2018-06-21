// @flow
import React from 'react'
import { requireNativeComponent, ViewPropTypes } from 'react-native'

type Props = {
  hash: string,
  path: string,
  resizeMode: string
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
