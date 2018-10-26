import React from 'react'
import Icons from './Icons'
import HeaderButtons, { HeaderButton } from 'react-navigation-header-buttons'
import Colors from '../Themes/Colors'

// define IconComponent, color, sizes and OverflowIcon in one place
const TextileHeaderButton = (props: any) => {
  const color = !props.color ? !props.iconName ? Colors.brandBlue : Colors.charcoal : props.color
  const fontSize = !props.iconName ? 17 : 23
  return (
    <HeaderButton {...props} IconComponent={Icons} buttonStyle={{ fontFamily: 'BentonSans', fontSize }} color={color} />
  )
}

export const TextileHeaderButtons = (props: any) => {
  return (
    <HeaderButtons
      HeaderButtonComponent={TextileHeaderButton}
      OverflowIcon={<Icons name={'more-horizontal'} size={23} color={Colors.charcoal} />}
      {...props}
    />
  )
}

export const Item = (props: any) => {
  return (
    <HeaderButtons.Item {...props} />
  )
}
