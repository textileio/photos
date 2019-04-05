import React from 'react'
import { connect } from 'react-redux'
import { ImageProps, Image, ImageStyle, LayoutChangeEvent, View, ImageBackground } from 'react-native'
import Icon from '@textile/react-native-icon'
import { RootState } from '../Redux/Types'
import Config from 'react-native-config'
import TextileImage from './TextileImage'
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
  ipfsError?: boolean
}

class Avatar extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      borderRadius: 0,
      defaultSize: 100
    }
  }

  shouldComponentUpdate (nextProps, nextState) {
    const refresh = nextProps.target !== this.props.target ||
      nextState.ipfsError !== this.state.ipfsError ||
      // node status hasn't changed
      (nextProps.online && !this.props.online) ||
      (nextProps.started && !this.props.started) ||
      // display dimensions haven't changed
      nextState.borderRadius !== this.state.borderRadius ||
      (nextProps.style && !this.props.style) ||
      (nextProps.style !== undefined && this.props.style !== undefined && nextProps.style.width !== this.props.style.width)
    return refresh
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

  render () {
    const { style, icon, target, local, started, online } = this.props
    const width = style && style.width ? style.width : this.state.defaultSize
    const height = style && style.height ? style.height : width

    const { borderRadius: radius } = this.state
    const borderRadius = style && style.borderRadius ? style.borderRadius : typeof width === 'number' ? width / 2 : radius

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
            padding: 0, margin: 0
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
    const widthNumber = typeof width === 'number' ? width as number : this.state.defaultSize
    if (local && started) {
      return (
        <View style={{ ...(this.props.style || {}), width, height, borderRadius, overflow: 'hidden' }}>
          <TextileImage
            style={{ width, height, borderRadius }}
            target={target}
            index={0}
            forMinWidth={widthNumber}
            resizeMode={'cover'}
            onLayout={this.onImageLayout}
          />
        </View>
      )
    }

    // Progressive HTTP to IPFS avatar
    const file = widthNumber <= 50 || this.state.ipfsError ? 'small' : 'large'
    return (
      <View
        style={{ ...(this.props.style || {}), width, height, borderRadius, overflow: 'hidden' }}
      >
        <ImageBackground
          style={{
            minHeight: height,
            minWidth: width,
            alignSelf: 'center',
            backgroundColor: 'transparent'
          }}
          source={{
            uri: `${Config.RN_TEXTILE_CAFE_GATEWAY_URL}/ipfs/${target}/0/small/d`,
            cache: 'force-cache'
          }}
          resizeMode={'cover'}
        >
          {online && !this.state.ipfsError &&
            <TextileImage
              style={{
                minHeight: height,
                minWidth: width,
                alignSelf: 'center',
                backgroundColor: 'transparent'
              }}
              target={`${target}/0/${file}/d`}
              ipfs={true}
              index={0}
              forMinWidth={widthNumber}
              resizeMode={'cover'}
              onLayout={this.onImageLayout}
              onError={this.onIPFSError}
            />
          }
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

  let color = 'hsla(200, 60%, 100%, 0.3)'
  if (target) {
    const h = Math.floor(360 * target.charCodeAt(target.length - 1) / 125)
    const hue = h < 360 ? h > 0 ? h : 0 : 360
    color = `hsla(${hue},90%,60%,0.3)`
  }

  const started = state.textile.nodeState.state === 'started'
  const online = state.textile.online

  return { target, local, started, color, online }
}

export default connect(mapStateToProps)(Avatar)
