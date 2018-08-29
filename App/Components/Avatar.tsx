import React from 'react'
import Config from 'react-native-config'
import ImageSc from 'react-native-scalable-image'
import { connect } from 'react-redux'
import {View, Image, ImageURISource, StyleProp, ViewStyle} from 'react-native'
import TextileImage from '../../TextileImage'
import { Profile } from '../Models/TextileTypes'

import styles from './Styles/AvatarStyles'
import {RootState} from '../Redux/Types'
import {NavigationScreenProps} from 'react-navigation'


interface Props extends NavigationScreenProps<{}> {
  height: number,
  width: number,
  owner?: boolean, // flags if it is known already to be the local user's profile
  peer_id?: string, // will auto check to see if it is the same as the local user's
  defaultSource?: number | ImageURISource | undefined,
  style?: StyleProp<ViewStyle>,
  profile?: Profile
  online?: boolean
}

class Avatar extends React.PureComponent<Props> {
  getCafeAddress (peer_id: string) {
    return Config.TEXTILE_CAFE_URI + '/ipns/' + peer_id + '/avatar'
  }
  photoIdFromAvatar () {
    const { profile } = this.props
    const avatar_id: string = profile && profile.avatar_id || ''
    return avatar_id && avatar_id.split('/').length > 1 && avatar_id.split('/')[2]
  }
  renderSelf () {
    const { height, width, defaultSource, style } = this.props
    const photoId = this.photoIdFromAvatar()
    return (
      <View style={[styles.container, style, {width, height, borderRadius: height / 2}]}>
        <View style={styles.stretch}>
          <TextileImage
            imageId={photoId}
            path={'small'}
            style={{width, height}}
            resizeMode={'cover'}
            width={width}
            height={height}
            defaultSource={defaultSource}
          />
        </View>
      </View>
    )
  }
  renderPeer (peer_id: string) {
    const { height, width, defaultSource, style } = this.props
    const avatarUri = this.getCafeAddress(peer_id)
    return (
      <View style={[styles.container, style, {width, height, borderRadius: height / 2}]}>
        <View style={styles.stretch}>
          <Image
            source={{uri: avatarUri}}
            resizeMode={'cover'}
            style={{width, height}}
            defaultSource={defaultSource}
          />
        </View>
      </View>
    )
  }

  renderPlaceholder = () => {
    const { height, width, defaultSource, style } = this.props
    return (
      <View style={[styles.container, style, {width, height, borderRadius: height / 2}]}>
        <View style={styles.stretch}>
          {defaultSource && <ImageSc
            style={{width, height}}
            width={width}
            height={height}
            source={defaultSource} />}
        </View>
      </View>
    )
  }

  render () {
    const { profile, online, owner } = this.props
    const peer_id = this.props.peer_id || profile && profile.id || undefined

    if (!peer_id) {
      // just fill the gap
      return this.renderPlaceholder()
    } else if (!online || !profile || profile.id != peer_id) {
      // if node not online, use cafe no matter what
      // if no profile provided, or the peer_id isn't own profile, use cafe
      return this.renderPeer(peer_id)
    } else if ((owner || profile.id === peer_id) && profile.avatar_id) {
      // peer_id isn't null and equals our profile.id
      // also the node is online, so let's render it now
      return this.renderSelf()
    }
    return this.renderPlaceholder()
  }
}


const mapStateToProps = (state: RootState) => {
  return {
    profile: state.preferences.profile,
    online: !!state.textileNode.online
  }
}

export default connect(mapStateToProps, undefined)(Avatar)
