import React from 'react'
import { View, ImageResizeMode } from 'react-native'
import { ImageStyle, Platform } from 'react-native'
import TextileImage from './TextileImage'

export interface IProgressiveImageProps {
  imageId: string,
  fileIndex: number,
  forMinWidth: number,
  showPreview?: boolean,
  isVisible?: boolean,
  resizeMode?: ImageResizeMode,
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
    return 100
  }

  android (resizeMode: ImageResizeMode) {
    const baseStyle: ImageStyle = {position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }
    const previewStyle: ImageStyle[] = [{ backgroundColor: 'transparent'}, baseStyle, this.state.androidPreview ? { height: 0 } : {}]
    // if no previewPath, don't try and render it here
    return (
      <View style={this.props.style} >
        {this.props.showPreview && <TextileImage
          target={this.props.imageId}
          index={this.props.fileIndex}
          forMinWidth={this.getPreviewWidth()}
          style={baseStyle}
          resizeMode={resizeMode}
          capInsets={this.props.capInsets}
        />}
        <TextileImage
          target={this.props.imageId}
          index={this.props.fileIndex}
          forMinWidth={this.props.forMinWidth}
          style={previewStyle}
          resizeMode={resizeMode}
          capInsets={this.props.capInsets}
          onLoad={this.androidLoad}
        />
      </View>
    )
  }

  ios(resizeMode: ImageResizeMode) {
    if (this.props.showPreview) {
      return (
        <TextileImage
          target={this.props.imageId}
          index={this.props.fileIndex}
          forMinWidth={this.getPreviewWidth()}
          style={this.props.style}
          resizeMode={resizeMode}
          capInsets={this.props.capInsets}
        >
          <TextileImage
            target={this.props.imageId}
            index={this.props.fileIndex}
            forMinWidth={this.props.forMinWidth}
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
        target={this.props.imageId}
        index={this.props.fileIndex}
        forMinWidth={this.props.forMinWidth}
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
          target={this.props.imageId}
          index={this.props.fileIndex}
          forMinWidth={this.props.forMinWidth}
          style={[{ backgroundColor: 'transparent' }, this.props.style || {}]}
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
