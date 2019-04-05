import React from 'react'
import { connect } from 'react-redux'
import { ImageProps, Image, ImageStyle, LayoutChangeEvent, View, StyleSheet } from 'react-native'
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
  showIcon: boolean
  defaultSize: number
}

class Avatar extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      borderRadius: 0,
      showIcon: false,
      defaultSize: 100
    }
  }

  onImageLayout = (event: LayoutChangeEvent) => {
    this.setState({
      borderRadius: event.nativeEvent.layout.width / 2
    })
  }

  onIconLoad = () => {
    this.setState({
      showIcon: true
    })
  }

  nodeImage (target: string, width: number | string, height: number | string, borderRadius: number) {
    const widthNumber = typeof width === 'number' ? width as number : this.state.defaultSize
    return (
      <View style={{ ...(this.props.style || {}), width, height, borderRadius, overflow: 'hidden' }}>
        <TextileImage
          style={{ minHeight: height, minWidth: width }}
          target={target}
          index={0}
          forMinWidth={widthNumber}
          resizeMode={'cover'}
          onLayout={this.onImageLayout}
        />
      </View>
    )
  }

  ipfsImage (online: boolean, target: string, width: number | string, height: number | string, borderRadius: number) {
    const widthNumber = typeof width === 'number' ? width : parseInt(width, 10)
    const file = widthNumber <= 50 ? 'small' : 'large'
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
        <View
          style={{
            flex: 1,
            position: 'relative'
          }}
        >
          {online &&
            <TextileImage
              style={{
                minHeight: height, minWidth: width, alignSelf: 'center'
              }}
              target={`${target}/0/${file}/d`}
              ipfs={true}
              index={0}
              forMinWidth={widthNumber}
              resizeMode={'cover'}
            />
          }
          <Image
            source={{
              uri: `${Config.RN_TEXTILE_CAFE_GATEWAY_URL}/ipfs/${target}/0/${file}/d`,
              cache: 'force-cache'
            }}
            style={{
              minHeight: height,
              minWidth: width,
              alignSelf: 'center'
            }}
            resizeMode={'cover'}
            onLayout={this.onImageLayout}
          />
        </View>
      </View>
    )
  }

  placeHolder (width: number | string, height: number | string, borderRadius: number, icon?: string) {
    const heightNumber = typeof height === 'number' ? height as number : this.state.defaultSize
    const borderWidth = this.props.style && this.props.style.borderWidth ? this.props.style.borderWidth as number : 0
    return (
      <View
        style={{
          ...(this.props.style || {}),
          borderRadius,
          width,
          height
        }}
      >
        <Icon
          style={{
            ...StyleSheet.absoluteFillObject
          }}
          name={icon || 'question-circle'}
          size={heightNumber - borderWidth}
          color={colors.grey_5}
          onLayout={this.onImageLayout}
        />
      </View>
    )
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
    // avoid 0
    const borderRadius = radius || (Number(width) / 2) + 4

    if (icon || !started || !target) {
      // returns an icon
      return this.placeHolder(width, height, borderRadius, icon)
    } else if (local) {
      // returns an image from local textile node
      return this.nodeImage(target, width, height, borderRadius)
    } else {
      // returns an image from http request
      return this.ipfsImage(online, target, width, height, borderRadius)
    }
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
