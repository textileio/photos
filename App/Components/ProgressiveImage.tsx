import React, { Fragment } from 'react'
import { StyleProp, ImageStyle, Platform } from 'react-native'
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

export interface ProgressiveImageState {
  androidPreview: boolean
}


export default class ProgressiveImage extends React.Component<ProgressiveImageProps, ProgressiveImageState> {
  constructor (props: ProgressiveImageProps) {
    super(props)
    this.state  = {
      androidPreview: true
    }
  }

  _androidLoad () {
    this.setState({androidPreview: false})
  }

  android () {
    return <Fragment>
      <TextileImage
        imageId={this.props.imageId}
        path={'thumb'}
        style={this.props.style}
        resizeMode={this.props.resizeMode}
        capInsets={this.props.capInsets}
      />
      <TextileImage
        imageId={this.props.imageId}
        path={this.props.path}
        style={[{backgroundColor: 'transparent'}, this.props.style, this.state.androidPreview && {height: 0}]}
        resizeMode={this.props.resizeMode}
        capInsets={this.props.capInsets}
        onLoad={this._androidLoad.bind(this)}
      />
    </Fragment>
  }

  ios() {
    return (<TextileImage
      imageId={this.props.imageId}
      path={'thumb'}
      style={this.props.style}
      resizeMode={this.props.resizeMode}
      capInsets={this.props.capInsets}
    >
      <TextileImage
        imageId={this.props.imageId}
        path={this.props.path}
        style={[{backgroundColor: 'transparent'}, this.props.style]}
        resizeMode={this.props.resizeMode}
        capInsets={this.props.capInsets}
      />
    </TextileImage>)
  }

  render () {
    const isVisible = this.props.isVisible !== undefined ? this.props.isVisible : true
    if (this.props.previewPath === undefined || isVisible === false) {
      return (<TextileImage
        imageId={this.props.imageId}
        path={this.props.path}
        style={[{backgroundColor: 'transparent'}, this.props.style]}
        resizeMode={this.props.resizeMode}
        capInsets={this.props.capInsets}
      />)
    } else {
      if (Platform.OS === 'ios') return this.ios()
      return this.android()
    }
  }
}
