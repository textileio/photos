import React from 'react'
import Icons from './Icons'
import HeaderButtons, { HeaderButton } from 'react-navigation-header-buttons'

// define IconComponent, color, sizes and OverflowIcon in one place
const TextileHeaderButton = props => {
  const color = !props.iconName ? 'blue' : 'black'
  return (
    <HeaderButton {...props} IconComponent={Icons} iconSize={23} buttonStyle={{fontFamily: 'BentonSans', fontSize: 17, color}} />
  )
}

export const TextileHeaderButtons = props => {
  return (
    <HeaderButtons
      HeaderButtonComponent={TextileHeaderButton}
      OverflowIcon={<Icons name='more' size={23} color='black' />}
      {...props}
    />
  )
}

export const Item = HeaderButtons.Item
