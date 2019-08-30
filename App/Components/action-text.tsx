import React from 'react'
import { View, Text, ViewStyle } from 'react-native'
import Icon from '@textile/react-native-icon'

import { spacing, size, textStyle, color } from '../styles'

interface Props {
  text: string
  iconName?: string
}

const CONTAINER: ViewStyle = {
  flexDirection: 'row',
  alignItems: 'center'
}

const ICON: ViewStyle = {
  paddingRight: spacing._008
}

function actionText(props: Props) {
  return (
    <View style={CONTAINER}>
      {props.iconName && (
        <Icon
          style={ICON}
          name={props.iconName}
          size={size._024}
          color={color.grey_4}
        />
      )}
      <Text style={{ ...textStyle.action_xs, color: color.grey_4 }}>
        {props.text}
      </Text>
    </View>
  )
}

export default actionText
