import React from 'react'
import { connect } from 'react-redux'

import {RootState} from '../Redux/Types'

import { View, ImageResizeMode, ImageStyle, Platform } from 'react-native'
import TextileImage from './TextileImage'
import { TextileEventsSelectors } from '../Redux/TextileEventsRedux'

export interface IProgressiveImageProps {
  imageId: string,
  fileIndex: number,
  forMinWidth: number,
  schema?: string,
  showPreview?: boolean,
  isVisible?: boolean,
  resizeMode?: ImageResizeMode,
  capInsets?: string,
  style?: ImageStyle
}

interface IProgressiveImageState {
  largeSuccess: boolean
  thumbSuccess: boolean
  smallSuccess: boolean
}

type Props = IProgressiveImageProps & StateProps
class ProgressiveImage extends React.Component<Props> {

  state: IProgressiveImageState = {
    largeSuccess: false,
    smallSuccess: false,
    thumbSuccess: false
  }

  shouldComponentUpdate(nextProps: Props, nextState: IProgressiveImageState) {
    return this.props.started !== nextProps.started ||
    this.state.largeSuccess !== nextState.largeSuccess ||
    this.state.smallSuccess !== nextState.smallSuccess ||
    this.state.thumbSuccess !== nextState.thumbSuccess
  }

  largeOnLoad = () => {
    this.setState({ largeSuccess: true })
  }

  thumbOnLoad = () => {
    this.setState({ thumbSuccess: true })
  }
  smallOnLoad = () => {
    this.setState({ smallSuccess: true })
  }

  getThumbWidth = () => {
     // TextileImage will 3x this
    return 30
  }

  getSmallWidth = () => {
     // TextileImage will 3x this
    return Math.min(100, this.props.forMinWidth)
  }

  getFullWidth = () => {
     // TextileImage will 3x this
    return Math.min(300, this.props.forMinWidth)
  }

  android(resizeMode: ImageResizeMode) {
    const thumbStyle: ImageStyle = {position: 'absolute', top: 0, bottom: 0, left: 0, right: 0 }
    const smallStyle: ImageStyle[] = [{ backgroundColor: 'transparent'}, thumbStyle, !this.state.smallSuccess ? { height: 0 } : {}]
    const previewStyle: ImageStyle[] = [{ backgroundColor: 'transparent'}, thumbStyle, !this.state.largeSuccess ? { height: 0 } : {}]
    // if no previewPath, don't try and render it here
    return (
      <View style={this.props.style} >
        {this.props.started && <TextileImage
          target={this.props.imageId}
          index={this.props.fileIndex}
          forMinWidth={this.getThumbWidth()}
          style={thumbStyle}
          resizeMode={resizeMode}
          capInsets={this.props.capInsets}
          onLoad={this.thumbOnLoad}
        />}
        {this.state.thumbSuccess && <TextileImage
          target={this.props.imageId}
          index={this.props.fileIndex}
          forMinWidth={this.getSmallWidth()}
          style={smallStyle}
          resizeMode={resizeMode}
          capInsets={this.props.capInsets}
          onLoad={this.smallOnLoad}
        />}
        {(this.state.smallSuccess) && <TextileImage
          target={this.props.imageId}
          index={this.props.fileIndex}
          forMinWidth={this.getFullWidth()}
          style={previewStyle}
          resizeMode={resizeMode}
          capInsets={this.props.capInsets}
          onLoad={this.largeOnLoad}
        />}
      </View>
    )
  }

  ios(resizeMode: ImageResizeMode) {
    if (this.props.showPreview) {
      return (
        <TextileImage
          target={this.props.imageId}
          index={this.props.fileIndex}
          forMinWidth={this.getThumbWidth()}
          style={this.props.style}
          resizeMode={resizeMode}
          capInsets={this.props.capInsets}
        >
          <TextileImage
            target={this.props.imageId}
            index={this.props.fileIndex}
            forMinWidth={this.getSmallWidth()}
            style={[{ backgroundColor: 'transparent' }, this.props.style || {}]}
            resizeMode={resizeMode}
            capInsets={this.props.capInsets}
          >
            <TextileImage
              target={this.props.imageId}
              index={this.props.fileIndex}
              forMinWidth={this.getFullWidth()}
              style={[{ backgroundColor: 'transparent' }, this.props.style || {}]}
              resizeMode={resizeMode}
              capInsets={this.props.capInsets}
            />
          </TextileImage>
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

  render() {
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

interface StateProps {
  started: boolean
}
const mapStateToProps = (state: RootState): StateProps => {
  return {
    started: TextileEventsSelectors.started(state)
  }
}

export default connect(mapStateToProps, undefined)(ProgressiveImage)
