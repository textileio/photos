import React from 'react'
import { connect } from 'react-redux'
import { ImageProps, Image, ImageStyle, LayoutChangeEvent, View } from 'react-native'
import { RootState } from '../Redux/Types'
import Config from 'react-native-config'
import TextileImage from './TextileImage'
import Icon from './Icon'
import * as s from '../Themes/Constants'

interface OwnProps {
  self?: boolean
  target?: string
  style?: ImageStyle
}

interface StateProps {
  target?: string
  local: boolean
  started: boolean
  color: string
}

type Props = OwnProps & StateProps & Partial<ImageProps>

interface State {
  borderRadius: number
  showIcon: boolean
}

class Avatar extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      borderRadius: 0,
      showIcon: false
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

  render () {
    const { style, target, local, started, color } = this.props

    const defaultSize = 100
    let width: string | number = defaultSize
    let height: string | number = defaultSize
    if (style) {
      if (style.width) {
        width = height = style.width
      } else if (style.height) {
        width = height = style.height
      }
    }
    const { borderRadius: radius } = this.state

    if (!started || !target) {
      return (
        <Icon
          style={{ ...(this.props.style || {}), width, height, borderRadius: radius }}
          name={'question-circle'}
          size={height as number}
          color={s.COLOR_GREY_LIGHT}
          onLayout={this.onImageLayout}
        />
      )
    }

    // local means the target belongs to the local node
    if (local) {
      return (
        <View style={{ ...(this.props.style || {}), width, height, borderRadius: radius, overflow: 'hidden' }}>
          <TextileImage
            style={{ ...(this.props.style || {}), width, height, borderRadius: radius }}
            target={target}
            index={0}
            forMinWidth={width as number}
            resizeMode={'cover'}
            onLayout={this.onImageLayout}
          />
        </View>
      )
    }

    const tintColor = !this.state.showIcon ? { tintColor: color } : {}
    return (
      <Image
        {...this.props}
        source={{ uri: `${Config.RN_TEXTILE_CAFE_GATEWAY_URL}/ipfs/${target}/0/small/d` }}
        style={{ ...(this.props.style || {}), ...tintColor, width, height, borderRadius: radius }}
        resizeMode={'cover'}
        onLayout={this.onImageLayout}
        defaultSource={require('../Images/v2/empty.png')}
        onLoad={this.onIconLoad}
      />
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

  const started = state.textileNode.nodeState.state === 'started'

  return { target, local, started, color }
}

export default connect(mapStateToProps)(Avatar)
