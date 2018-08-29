import React from 'react'
import { StyleProp, ImageStyle } from 'react-native'
import TextileImage from '../../TextileImage'

export interface ProgressiveImageProps {
  imageId: string,
  path: string,
  previewPath?: string,
  isVisible?: boolean,
  resizeMode?: string,
  capInsets?: string,
  style?: StyleProp<ImageStyle>
}

export default class ProgressiveImage extends React.Component<ProgressiveImageProps> {
  render () {
    const isVisible = this.props.isVisible !== undefined ? this.props.isVisible : true
    if (this.props.previewPath === undefined || isVisible === false) {
      return (<TextileImage
        imageId={this.props.imageId}
        path={this.props.path}
        style={[{backgroundColor: 'transparent', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}, this.props.style]}
        resizeMode={this.props.resizeMode}
        capInsets={this.props.capInsets}
      />)
    } else {
      return (<TextileImage
        imageId={this.props.imageId}
        path={'thumb'}
        style={[{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}, this.props.style]}
        resizeMode={this.props.resizeMode}
        capInsets={this.props.capInsets}
      >
        <TextileImage
          imageId={this.props.imageId}
          path={this.props.path}
          style={[{backgroundColor: 'transparent', position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}, this.props.style]}
          resizeMode={this.props.resizeMode}
          capInsets={this.props.capInsets}
        />
      </TextileImage>)
    }
  }
}
