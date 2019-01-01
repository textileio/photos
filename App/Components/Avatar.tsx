import React from 'react'
import { connect } from 'react-redux'
import { ImageProps, Image, ImageStyle, ImageSourcePropType, LayoutChangeEvent, View } from 'react-native'
import { RootState } from '../Redux/Types'
import Config from 'react-native-config'
import TextileImage from './TextileImage'
import Icon from './Icon'
import * as s from '../Themes/Constants'

interface OwnProps {
  peerId?: string
  style?: ImageStyle
}

interface StateProps {
  localPeerId?: string
  online: boolean
  peerColor: string
  localAvatar?: string
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
    let width: string | number = 100
    let height: string | number = width
    const w = this.props.style && this.props.style.width
    const h = this.props.style && this.props.style.height
    if (w) {
      width = w
      height = w
    } else if (h) {
      width = h
      height = h
    }

    const { peerId, localPeerId, online, localAvatar } = this.props

    const isLocalUser = (!peerId && localPeerId) || peerId === localPeerId

    const peerIdToUse = peerId || localPeerId
    const uri = peerIdToUse ? `${Config.RN_TEXTILE_CAFE_GATEWAY_URL}/ipns/${peerIdToUse}/avatar/large` : undefined

    const widthNumber = typeof width === 'number' ? width as number : undefined
    const heightNumber = typeof height === 'number' ? height as number : undefined

    if (isLocalUser && online && localAvatar && widthNumber) {
      // Render TextileImage
      return (
        <TextileImage
          style={{ ...(this.props.style || {}), width, height, borderRadius: this.state.borderRadius }}
          target={localAvatar}
          index={0}
          forMinWidth={widthNumber}
          resizeMode={'cover'}
          onLayout={this.onImageLayout}
        />
      )
    } else if (uri) {
      const uniqueUserColor = !this.state.showIcon ? {
        tintColor: this.props.peerColor
      } : {}
      return (
        <Image
          {...this.props}
          source={{ uri }}
          style={{ ...(this.props.style || {}), ...uniqueUserColor, width, height, borderRadius: this.state.borderRadius }}
          resizeMode={'cover'}
          onLayout={this.onImageLayout}
          defaultSource={require('../Images/v2/empty.png')}
          onLoad={this.onIconLoad}
        />
      )
    } else if (heightNumber) {
      return (
        <Icon
          style={{ width, height, borderRadius: this.state.borderRadius }}
          name={'question-circle'}
          size={heightNumber}
          color={s.COLOR_GREY_LIGHT}
          onLayout={this.onImageLayout}
        />
      )
    } else {
      return <View />
    }
  }
}

const mapStateToProps = (state: RootState, ownProps: OwnProps): StateProps => {
  const avatarUri = state.account.profile.value ? state.account.profile.value.avatar_uri : undefined
  let localAvatar: string | undefined
  if (avatarUri) {
    const parts = avatarUri.split('/')
    if (parts.length > 2) {
      localAvatar = parts[2]
    }
  }

  let peerColor = 'hsla(200, 60%, 100%, 0.3)'
  if (ownProps.peerId) {
    const last = ownProps.peerId.length - 1
    const h = Math.floor(100 + 120 * ownProps.peerId[last - 1].charCodeAt() / 125)
    const l = Math.floor(40 + 40 * ownProps.peerId[last].charCodeAt() / 125)
    const lit = l < 100 ? l > 0 ? l : 0 : 100
    const hue = h < 360 ? h > 0 ? h : 0 : 360
    peerColor = `hsla(${hue},60%,${lit}%,0.3)`
  }

  return {
    localPeerId: state.account.peerId.value,
    online: state.textileNode.online,
    localAvatar,
    peerColor
  }
}

export default connect(mapStateToProps)(Avatar)
