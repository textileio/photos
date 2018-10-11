import React, { Fragment } from 'react'
import { View } from 'react-native'
import { StyleProp, ImageStyle, Platform } from 'react-native'
// @ts-ignore
import TextileImage from '../../TextileImage'

export interface IProgressiveImageProps {
  imageId: string,
  path: string,
  previewPath?: string,
  isVisible?: boolean,
  resizeMode?: string,
  capInsets?: string,
  style?: StyleProp<ImageStyle>
}

export interface IProgressiveImageState {
  androidPreview: boolean
}

export default class ProgressiveImage extends React.Component<IProgressiveImageProps, IProgressiveImageState> {
  constructor (props: IProgressiveImageProps) {
    super(props)
    this.state  = {
      androidPreview: true
    }
  }

  androidLoad = () => {
    this.setState({ androidPreview: false })
  }

  android () {
    return (
      <View style={this.props.style} >
        <TextileImage
          imageId={this.props.imageId}
          path={this.props.previewPath}
          style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }}
          resizeMode={this.props.resizeMode}
          capInsets={this.props.capInsets}
        />
        <TextileImage
          imageId={this.props.imageId}
          path={this.props.path}
          style={[{ backgroundColor: 'transparent', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }, this.state.androidPreview && { height: 0 }]}
          resizeMode={this.props.resizeMode}
          capInsets={this.props.capInsets}
          onLoad={this.androidLoad}
        />
      </View>
    )
  }

  ios() {
    return (
      <TextileImage
        imageId={this.props.imageId}
        path={this.props.previewPath}
        style={this.props.style}
        resizeMode={this.props.resizeMode}
        capInsets={this.props.capInsets}
      >
        <TextileImage
          imageId={this.props.imageId}
          path={this.props.path}
          style={[{ backgroundColor: 'transparent' }, this.props.style]}
          resizeMode={this.props.resizeMode}
          capInsets={this.props.capInsets}
        />
      </TextileImage>
    )
  }

  render () {
    const isVisible = this.props.isVisible !== undefined ? this.props.isVisible : true
    if (this.props.previewPath === undefined || !isVisible) {
      return (
        <TextileImage
          imageId={this.props.imageId}
          path={this.props.path}
          style={[{ backgroundColor: 'transparent' }, this.props.style]}
          resizeMode={this.props.resizeMode}
          capInsets={this.props.capInsets}
        />
      )
    }
    if (Platform.OS === 'ios') {
      return this.ios()
    }
    return this.android()
  }
}
