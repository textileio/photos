import React from 'react'
import { connect } from 'react-redux'
import {
  ImageProps,
  ImageStyle,
  LayoutChangeEvent,
  View,
  ImageBackground
} from 'react-native'
import Icon from '@textile/react-native-icon'
import { RootState } from '../Redux/Types'
import Config from 'react-native-config'
import TextileImage from './TextileImage'
import { TextileEventsSelectors } from '../Redux/TextileEventsRedux'
import { color as colors } from '../styles'

interface OwnProps {
  self?: boolean
  icon?: string
  target?: string
  style?: ImageStyle
}

interface StateProps {
  target?: string
  local: boolean
  started: boolean
  online: boolean
}

type Props = OwnProps & StateProps & Partial<ImageProps>

interface State {
  borderRadius: number
  defaultSize: number
  httpSuccess: boolean
  ipfsError?: boolean
}

class Avatar extends React.Component<Props, State> {
  state: State = {
    borderRadius: 0,
    defaultSize: 50,
    httpSuccess: false
  }

  shouldComponentUpdate(nextProps: Props, nextState: State) {
    return (
      nextProps.target !== this.props.target ||
      nextState.ipfsError !== this.state.ipfsError ||
      // node status hasn't changed
      (nextProps.online && !this.props.online) ||
      (nextProps.started && !this.props.started) ||
      // display dimensions haven't changed
      nextState.borderRadius !== this.state.borderRadius ||
      (nextProps.style && !this.props.style) ||
      (nextProps.style !== undefined &&
        this.props.style !== undefined &&
        nextProps.style.width !== this.props.style.width)
    )
  }

  onImageLayout = (event: LayoutChangeEvent) => {
    this.setState({
      borderRadius: event.nativeEvent.layout.width / 2
    })
  }

  onIPFSError = () => {
    this.setState({
      ipfsError: true
    })
  }
  onHTTPLoad = () => {
    // allow app to skip iPFS request if HTTP has already completed
    this.setState({
      httpSuccess: true
    })
  }

  shouldShowIPFS = (resolution: string) => {
    // Node should be online, no IPFS error already, and HTTP shouldn't have allready succeeded
    return (
      this.props.online &&
      !this.state.ipfsError &&
      (!this.state.httpSuccess || resolution !== 'small')
    )
  }

  render() {
    const { style, icon, target, local, started, online } = this.props
    const width = style && style.width ? style.width : this.state.defaultSize
    const height = style && style.height ? style.height : width

    const { borderRadius: radius } = this.state
    const borderRadius =
      style && style.borderRadius
        ? style.borderRadius
        : typeof width === 'number'
        ? width / 2
        : radius

    // If requested or if no target is known, show the ( ? ) icon
    if (icon || !target) {
      const fontSize = Math.ceil(this.state.borderRadius * 2)
      return (
        <View
          style={{
            ...(this.props.style || {}),
            backgroundColor: undefined,
            borderRadius,
            width,
            height,
            overflow: 'hidden',
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 0,
            margin: 0
          }}
        >
          <Icon
            style={{ fontSize, lineHeight: fontSize, textAlign: 'center' }}
            name={icon || 'question-circle'}
            size={fontSize}
            color={colors.grey_5}
            onLayout={this.onImageLayout}
          />
        </View>
      )
    }

    // If 'local' is requested, it is a local user avatar, so request can be made once 'start'
    const widthNumber =
      typeof width === 'number' ? (width as number) : this.state.defaultSize
    if (local && started) {
      return (
        <View
          style={{
            ...(this.props.style || {}),
            width,
            height,
            borderRadius,
            overflow: 'hidden'
          }}
        >
          <ImageBackground
            style={{
              minHeight: height,
              minWidth: width,
              alignSelf: 'center',
              backgroundColor:
                this.props.style && this.props.style.backgroundColor
                  ? this.props.style.backgroundColor
                  : 'transparent'
            }}
            source={{
              uri: `${
                Config.RN_TEXTILE_GATEWAY_URL
              }/ipfs/${target}/0/small/content`,
              cache: 'force-cache'
            }}
            resizeMode={'cover'}
          >
            <TextileImage
              style={{
                minHeight: height,
                minWidth: width,
                alignSelf: 'center',
                backgroundColor: 'transparent',
                borderRadius
              }}
              target={target}
              index={0}
              forMinWidth={widthNumber}
              resizeMode={'cover'}
              onLayout={this.onImageLayout}
            />
          </ImageBackground>
        </View>
      )
    }

    // Progressive HTTP to IPFS avatar
    const resolution =
      widthNumber <= 50 || this.state.ipfsError ? 'small' : 'large'
    const shouldShowIPFS = this.shouldShowIPFS(resolution)
    return (
      <View
        style={{
          ...(this.props.style || {}),
          width,
          height,
          borderRadius,
          overflow: 'hidden'
        }}
      >
        <ImageBackground
          style={{
            minHeight: height,
            minWidth: width,
            alignSelf: 'center',
            backgroundColor:
              this.props.style && this.props.style.backgroundColor
                ? this.props.style.backgroundColor
                : 'transparent'
          }}
          source={{
            uri: `${
              Config.RN_TEXTILE_GATEWAY_URL
            }/ipfs/${target}/0/small/content`,
            cache: 'force-cache'
          }}
          resizeMode={'cover'}
          onLoad={this.onHTTPLoad}
        >
          {shouldShowIPFS && (
            <TextileImage
              style={{
                minHeight: height,
                minWidth: width,
                alignSelf: 'center',
                backgroundColor: 'transparent'
              }}
              target={`${target}/0/${resolution}/content`}
              ipfs={true}
              index={0}
              forMinWidth={widthNumber}
              resizeMode={'cover'}
              onLayout={this.onImageLayout}
              onError={this.onIPFSError}
            />
          )}
        </ImageBackground>
      </View>
    )
  }
}

const mapStateToProps = (state: RootState, ownProps: OwnProps): StateProps => {
  let target = ownProps.target

  const profile = state.account.profile.value
  const localTarget = profile ? profile.avatar : undefined
  const local = ownProps.self || target === localTarget
  if (local) {
    target = localTarget
  }

  const started = TextileEventsSelectors.started(state)
  const online = TextileEventsSelectors.online(state)

  return { target, local, started, online }
}

export default connect(mapStateToProps)(Avatar)
