import React from 'react'
import { connect } from 'react-redux'
import { ImageProps, Image, ImageStyle, ImageSourcePropType, LayoutChangeEvent } from 'react-native'
import { RootState } from '../Redux/Types'
import Config from 'react-native-config'

interface OwnProps {
  peerId?: string
  style?: ImageStyle
}

interface StateProps {
  localPeerId?: string
}

type Props = OwnProps & StateProps & Partial<ImageProps>

interface State {
  borderRadius: number
}

class Avatar extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props)
    this.state = {
      borderRadius: 0
    }
  }

  onImageLayout = (event: LayoutChangeEvent) => {
    this.setState({
      borderRadius: event.nativeEvent.layout.width / 2
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

    const { peerId, localPeerId } = this.props
    const peerIdToUse = peerId || localPeerId
    const uri = peerIdToUse ? `${Config.RN_TEXTILE_CAFE_URI_PREFIX}127.0.0.1:5050/ipns/${peerIdToUse}/avatar/large` : undefined
    if (uri) {
      return <Image {...this.props} source={{ uri }} style={{ ...(this.props.style || {}), width, height, borderRadius: this.state.borderRadius }} resizeMode={'cover'} onLayout={this.onImageLayout} />
    }
  }
}

const mapStateToProps = (state: RootState): StateProps => ({
  localPeerId: state.account.peerId.value
})

export default connect(mapStateToProps)(Avatar)
