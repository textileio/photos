import React from 'react'
import Icons from './Icons'
import HeaderButtons, { HeaderButton } from 'react-navigation-header-buttons'

// define IconComponent, color, sizes and OverflowIcon in one place
const TextileHeaderButton = props => {
  const color = !props.iconName ? 'blue' : 'black'
  const fontSize = !props.iconName ? 17 : 24
  return (
    <HeaderButton {...props} IconComponent={Icons} buttonStyle={{fontFamily: 'BentonSans', fontSize, color}} />
  )
}

export const TextileHeaderButtons = props => {
  return (
    <HeaderButtons
      HeaderButtonComponent={TextileHeaderButton}
      OverflowIcon={<Icons name='more' size={32} color='black' />}
      {...props}
    />
  )
}

export const Item = HeaderButtons.Item
