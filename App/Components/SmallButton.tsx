import React from 'react'
import Button from './Button'
import * as s from '../Themes/Constants'

interface Props {
  text: string
  disabled?: boolean
  onPress?: () => void
}

const button = (props: Props) => {
  const { text, onPress } = props
  return (
    <Button
      text={text.toUpperCase()}
      textStyle={{
        fontFamily: 'Biotif-Bold',
        fontSize: 10,
        letterSpacing: 2,
        paddingLeft: 2
      }}
      style={{
        paddingHorizontal: 8,
        paddingVertical: 4,
        backgroundColor: s.COLOR_BRAND_BLUE
      }}
      disabled={props.disabled}
      onPress={onPress}
    />
  )
}

export default button
