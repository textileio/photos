import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import Icon from '@textile/react-native-icon'
import TextileImage from '../TextileImage'
import { IContact, IFiles } from '@textile/react-native-sdk'

import Members from './Members'

import styles, {
  cardImageStyle,
  ICON_WIDTH,
  ROW_COLUMN
} from './statics/styles'
import { color } from '../../styles'

interface ScreenProps {
  id: string
  name: string
  members: IContact[]
  thumb?: IFiles
  onPress: (groupCardProps: any) => void
}

const GroupCard = (props: ScreenProps) => {
  const { name, members, thumb } = props
  const getCallback = () => {
    return () => {
      props.onPress(props)
    }
  }
  const getThumb = (): JSX.Element => {
    if (thumb) {
      return (
        <View style={styles.imageContainer}>
          <View style={styles.imageStretch}>
            <TextileImage
              target={thumb.data}
              index={0}
              forMinWidth={ICON_WIDTH}
              resizeMode={'cover'}
              style={{ height: ROW_COLUMN }}
            />
          </View>
        </View>
      )
    }
    return (
      <Icon
        style={styles.iconStyle}
        name={'image'}
        size={ICON_WIDTH}
        color={color.grey_4}
      />
    )
  }
  return (
    <TouchableOpacity
      style={styles.groupCard}
      activeOpacity={0.95}
      // ts-ignore
      onPress={getCallback()}
    >
      <View style={styles.groupLeftColumn}>{getThumb()}</View>
      <View style={styles.groupMiddleColumn}>
        <Text numberOfLines={1} style={styles.groupName}>
          {name}
        </Text>
      </View>
      <View style={styles.groupRightColumn}>
        <Members members={members} />
      </View>
    </TouchableOpacity>
  )
}

export default GroupCard
