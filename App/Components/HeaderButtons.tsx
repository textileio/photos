import React from 'react'
import Icon from '@textile/react-native-icon'
import HeaderButtons, { HeaderButton } from 'react-navigation-header-buttons'
import Colors from '../Themes/Colors'

// define IconComponent, color, sizes and OverflowIcon in one place
const TextileHeaderButton = (props: any) => {
  const color = !props.color
    ? !props.iconName
      ? Colors.brandBlue
      : Colors.charcoal
    : props.color
  const fontSize = !props.iconName ? 17 : 24
  return (
    <HeaderButton
      {...props}
      IconComponent={Icon}
      buttonStyle={{ fontFamily: 'Biotif-Regular', fontSize }}
      color={color}
    />
  )
}

export const TextileHeaderButtons = (props: any) => {
  return (
    <HeaderButtons
      HeaderButtonComponent={TextileHeaderButton}
      OverflowIcon={
        <Icon name={'more-horizontal'} size={24} color={Colors.charcoal} />
      }
      {...props}
    />
  )
}

export const Item = (props: any) => {
  return <HeaderButtons.Item {...props} />
}
