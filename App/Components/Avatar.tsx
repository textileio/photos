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
  color: string
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
    const { style, icon, target, local, started, online, color } = this.props
    let width: string | number = this.state.defaultSize
    let height: string | number = this.state.defaultSize
    if (style) {
      if (style.width) {
        width = height = style.width
      } else if (style.height) {
        width = height = style.height
      }
    }
    const { borderRadius: radius } = this.state
    const borderRadius = radius || Number(width) / 2

    // If requested or if no target is known, show the ( ? ) icon
    if (icon || !target) {
      const heightNumber = typeof height === 'number' ? height as number : this.state.defaultSize
      const borderWidth = this.props.style && this.props.style.borderWidth ? this.props.style.borderWidth as number : 0
      return (
        <View
          style={{
            ...(this.props.style || {}),
            borderRadius,
            width,
            height,
            alignContent: 'center',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Icon
            style={{ width, height, textAlign: 'center' }}
            name={icon || 'question-circle'}
            size={heightNumber - borderWidth}
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
            style={{ ...(this.props.style || {}), width, height, borderRadius }}
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
            alignSelf: 'center'
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
                alignSelf: 'center'
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
