import React from 'react'
import Config from 'react-native-config'
import ImageSc from 'react-native-scalable-image'
import { connect } from 'react-redux'
import { View, ImageURISource, StyleProp, ViewStyle } from 'react-native'
import TextileImage from '../../TextileImage'
import { Profile } from '../Models/TextileTypes'

import styles from './Styles/AvatarStyles'
import { RootState } from '../Redux/Types'

interface IPropsFromState {
  profile: Profile | undefined
  online: boolean
}

export interface IAvatarProps extends IPropsFromState {
  height: number
  width: number
  owner?: boolean // flags if it is known already to be the local user's profile
  peerId?: string // will auto check to see if it is the same as the local user's
  defaultSource?: number | ImageURISource
  style?: StyleProp<ViewStyle>
}

class Avatar extends React.PureComponent<IAvatarProps> {
  getCafeAddress (peerId: string) {
    return `${Config.TEXTILE_CAFE_URI}/ipns/${peerId}/avatar`
  }
  photoIdFromAvatar () {
    const { profile } = this.props
    const avatarId: string = profile && profile.avatar_id || ''
    return avatarId && avatarId.split('/').length > 1 && avatarId.split('/')[2]
  }
  renderSelf () {
    const { height, width, defaultSource, style } = this.props
    const photoId = this.photoIdFromAvatar()
    if (!photoId) {
      return (
        <View style={[styles.container, style, { width, height, borderRadius: height / 2 }]}>
          <View style={styles.stretch}>
            <ImageSc
              source={defaultSource}
              style={{ width, height }}
              width={width}
              height={height}
              resizeMode={'cover'}
            />
          </View>
        </View>
      )
    }
    return (
      <View style={[styles.container, style, { width, height, borderRadius: height / 2 }]}>
        <View style={styles.stretch}>
          <TextileImage
            imageId={photoId}
            path={'small'}
            style={{ width, height }}
            resizeMode={'cover'}
          />
        </View>
      </View>
    )
  }
  renderCafe (peerId: string) {
    const { height, width, defaultSource, style } = this.props
    const avatarUri = this.getCafeAddress(peerId)
    return (
      <View style={[styles.container, style, { width, height, borderRadius: height / 2 }]}>
        <View style={styles.stretch}>
          <ImageSc
            source={{ uri: avatarUri }}
            style={{ width, height }}
            width={width}
            height={height}
            defaultSource={defaultSource}
            resizeMode={'cover'}
          />
        </View>
      </View>
    )
  }

  renderPlaceholder = () => {
    const { height, width, defaultSource, style } = this.props
    return (
      <View style={[styles.container, style, { width, height, borderRadius: height / 2 }]}>
        <View style={styles.stretch}>
          { defaultSource && <ImageSc
            style={{ width, height }}
            width={width}
            height={height}
            source={defaultSource}
          />}
        </View>
      </View>
    )
  }

  render () {
    const { profile, online, owner, peerId } = this.props
    if (owner && (profile && profile.avatar_id !== undefined)) {
      if (!online || !profile.avatar_id) {
        // not online or no url and owner, render cafe
        return this.renderCafe(profile.id)
      }
      // owner, render local
      return this.renderSelf()
    }
    if (peerId) {
      if (online && profile && profile.id === peerId && profile.avatar_id) {
        // owner, render local
        return this.renderSelf()
      }
      // render cafe
      return this.renderCafe(peerId)
    }
    return this.renderPlaceholder()
  }
}

const mapStateToProps = (state: RootState): IPropsFromState => {
  return {
    profile: state.preferences.profile,
    online: !!state.textileNode.online
  }
}

export default connect(mapStateToProps, undefined)(Avatar)
