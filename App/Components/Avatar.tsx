import React from 'react'
import Config from 'react-native-config'
import ImageSc from 'react-native-scalable-image'
import { connect } from 'react-redux'
import {View, Image, ImageURISource, StyleProp, ViewStyle} from 'react-native'
import TextileImage from '../../TextileImage'
import { Profile } from '../Models/TextileTypes'

import styles from './Styles/AvatarStyles'
import { RootState } from '../Redux/Types'

interface PropsFromState {
  profile: Profile | undefined
  online: boolean
}

export interface AvatarProps extends PropsFromState {
  height: number,
  width: number,
  owner?: boolean, // flags if it is known already to be the local user's profile
  peer_id?: string, // will auto check to see if it is the same as the local user's
  defaultSource?: number | ImageURISource | undefined,
  style?: StyleProp<ViewStyle>
}

class Avatar extends React.PureComponent<AvatarProps> {
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
  renderCafe (peer_id: string) {
    const { height, width, defaultSource, style } = this.props
    const avatarUri = this.getCafeAddress(peer_id)
    console.log('axh avatar', avatarUri)
    return (
      <View style={[styles.container, style, {width, height, borderRadius: height / 2}]}>
        <View style={styles.stretch}>
          <ImageSc
            source={{uri: avatarUri}}
            style={{width, height}}
            width={width}
            height={height}
            defaultSource={defaultSource}
            resizeMode={'cover'} />
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
    const { profile, online, owner, peer_id } = this.props
    console.log('axh', 0)
    if (owner && (profile && profile.avatar_id !== undefined)) {
      console.log('axh', 1)
      if (!online || !profile.avatar_id) {
        console.log('axh', 2, profile)
        // not online or no url and owner, render cafe
        return this.renderCafe(profile.id)
      }
      console.log('axh', 3)
      // owner, render local
      return this.renderSelf()
    }
    else if (peer_id) {
      console.log('axh', 4)
      if (online && profile && profile.id === peer_id && profile.avatar_id) {
        console.log('axh', 5)
        // owner, render local
        return this.renderSelf()
      }
      console.log('axh', 6)
      // render cafe
      return this.renderCafe(peer_id)
    }
    console.log('axh', 7)
    return this.renderPlaceholder()
  }
}

const mapStateToProps = (state: RootState): PropsFromState => {
  return {
    profile: state.preferences.profile,
    online: !!state.textileNode.online
  }
}

export default connect(mapStateToProps, undefined)(Avatar)
