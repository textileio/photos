import React, { Fragment } from 'react'
import { View } from 'react-native'
import { ImageStyle, Platform } from 'react-native'
import TextileImage from './TextileImage'
import { PhotoId } from '../Models/TextileTypes'

export interface IProgressiveImageProps {
  imageId: PhotoId,
  minWidth: number,
  showPreview?: boolean,
  isVisible?: boolean,
  resizeMode?: string,
  capInsets?: string,
  style?: ImageStyle
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

  getPreviewWidth = () => {
    return Math.floor(this.props.minWidth / 2)
  }

  android (resizeMode: string) {
    const baseStyle: ImageStyle = {position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }
    const previewStyle: ImageStyle[] = [{ backgroundColor: 'transparent'}, baseStyle, this.state.androidPreview ? { height: 0 } : {}]
    // if no previewPath, don't try and render it here
    return (
      <View style={this.props.style} >
        {this.props.showPreview && <TextileImage
          imageId={this.props.imageId}
          minWidth={this.getPreviewWidth()}
          style={baseStyle}
          resizeMode={resizeMode}
          capInsets={this.props.capInsets}
        />}
        <TextileImage
          imageId={this.props.imageId}
          minWidth={this.props.minWidth}
          style={previewStyle}
          resizeMode={resizeMode}
          capInsets={this.props.capInsets}
          onLoad={this.androidLoad}
        />
      </View>
    )
  }

  ios(resizeMode: string) {
    if (this.props.showPreview) {
      return (
        <TextileImage
          imageId={this.props.imageId}
          minWidth={this.getPreviewWidth()}
          style={this.props.style}
          resizeMode={resizeMode}
          capInsets={this.props.capInsets}
        >
          <TextileImage
            imageId={this.props.imageId}
            minWidth={this.props.minWidth}
            style={[{ backgroundColor: 'transparent' }, this.props.style || {}]}
            resizeMode={resizeMode}
            capInsets={this.props.capInsets}
          />
        </TextileImage>
      )
    }
    // no preview path, just return the image
    return (
      <TextileImage
        imageId={this.props.imageId}
        minWidth={this.props.minWidth}
        style={[{ backgroundColor: 'transparent' }, this.props.style || {}]}
        resizeMode={resizeMode}
        capInsets={this.props.capInsets}
      />
    )
  }

  render () {
    const isVisible = this.props.isVisible !== undefined ? this.props.isVisible : true
    const resizeMode = this.props.resizeMode || 'center'
    if (!this.props.showPreview || !isVisible) {
      return (
        <TextileImage
          imageId={this.props.imageId}
          minWidth={this.props.minWidth}
          style={[{ backgroundColor: 'red' }, this.props.style || {}]}
          resizeMode={resizeMode}
          capInsets={this.props.capInsets}
        />
      )
    }
    if (Platform.OS === 'ios') {
      return this.ios(resizeMode)
    }
    return this.android(resizeMode)
  }
}
