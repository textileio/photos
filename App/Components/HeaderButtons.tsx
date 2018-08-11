import React from 'react'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Icons from './Icons'
import HeaderButtons, { HeaderButton } from 'react-navigation-header-buttons'

// define IconComponent, color, sizes and OverflowIcon in one place
const TextileHeaderButton = props => (
  <HeaderButton {...props} IconComponent={Icons} iconSize={23} color='black' />
)

export const TextileHeaderButtons = props => {
  return (
    <HeaderButtons
      HeaderButtonComponent={TextileHeaderButton}
      OverflowIcon={<MaterialIcons name="more-vert" size={23} color='black' />}
      {...props}
    />
  )
}

export const Item = HeaderButtons.Item
