import React from 'react'
import Config from 'react-native-config'
import {View, Image, ImageURISource, StyleProp, ViewStyle} from 'react-native'
import TextileImage from '../../TextileImage'
import { Profile, PhotoId } from '../Models/TextileTypes'

import styles from './Styles/AvatarStyles'

export type AvatarProps = {
  profile: Profile,
  peer_id?: string,
  height: number,
  width: number,
  defaultSource?: number | ImageURISource | undefined,
  style?: StyleProp<ViewStyle>
}

const PlaceHolderAvatar = (props: AvatarProps) => {
  const { height, width, defaultSource, style } = props
  const borderRadius = height / 2
  return (
    <View style={[styles.container, style, {width, height, borderRadius}]}>
      <View style={styles.stretch}>
        {defaultSource && <Image
          source={defaultSource}
          resizeMode={'cover'}
          style={{width, height}}
        />}
      </View>
    </View>
  )
}

const OwnAvatar = (props: AvatarProps) => {
  const { profile, height, width, defaultSource, style } = props
  const photoId = profile.avatar_id
  const borderRadius = height / 2
  return (
    <View style={[styles.container, style, {width, height, borderRadius}]}>
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

const PeerAvatar = (props: AvatarProps) => {
  const { peer_id, height, width, defaultSource, style } = props
  const avatarUri = Config.TEXTILE_CAFE_URI + '/ipns/' + peer_id+ '/avatar'
  const borderRadius = height / 2
  return (
    <View style={[styles.container, style, {width, height, borderRadius}]}>
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

const Avatar = (props: AvatarProps) => {
  const { profile, peer_id } = props
  if (!peer_id) {
    return PlaceHolderAvatar(props)
  } else if (profile.id !== peer_id) {
    return PeerAvatar(props)
  } else {
    return OwnAvatar(props)
  }
}

export default Avatar
