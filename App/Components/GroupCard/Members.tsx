import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Icon from '@textile/react-native-icon'
import TextileImage from '../TextileImage'
import Avatar from '../Avatar'
import { IContact } from '@textile/react-native-sdk'

import styles, {
  cardImageStyle,
  ICON_WIDTH,
  ROW_COLUMN
} from './statics/styles'
import { color } from '../../styles'

interface ScreenProps {
  members: IContact[]
}

class GroupMembers extends React.Component<ScreenProps> {
  shouldComponentUpdate(newProps: ScreenProps) {
    // aims to quiet down the number of refreshes happening on the group screen
    return newProps.members.length !== this.props.members.length
  }
  render() {
    const { members } = this.props

    return (
      <View style={styles.avatarContainer}>
        {members.slice(0, 8).map((mem: IContact, i: number) => {
          const imageStyle = cardImageStyle(members.length, i)
          return (
            <View key={mem.address} style={imageStyle}>
              <Avatar
                style={{
                  width: '100%',
                  height: '100%',
                  backgroundColor: color.grey_5
                }}
                target={mem.avatar}
              />
            </View>
          )
        })}
      </View>
    )
  }
}

export default GroupMembers
